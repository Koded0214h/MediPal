from django.shortcuts import get_object_or_404
from django.contrib.auth import logout

from decimal import Decimal
from .utils.ai import generate_health_goals

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

from .models import (
    CustomUser, HealthProfile, Wallet,
    Transaction, Provider, AIRecommendation
)
from .serializers import (
    UserSerializer, HealthProfileSerializer, TransactionSerializer,
    ProviderService, AIRecommendationSerializer
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Manually hash password
            raw_password = request.data.get('password')
            if raw_password:
                user.set_password(raw_password)
                user.is_active = True  # Ensure user is active
                
                Wallet.objects.create(user=user, balance=0, is_locked=False)
                
                user.save()

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'email': user.email,
                'fullName': user.fullName
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'email': user.email,
                    'fullName': user.fullName
                }, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            pass

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()  # Important for Token Auth
        except:
            pass
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # User info
        user_data = UserSerializer(user).data

        # Health profile
        try:
            profile = HealthProfile.objects.get(user=user)
            profile_data = HealthProfileSerializer(profile).data
        except HealthProfile.DoesNotExist:
            profile_data = {}

        # Latest AI recommendation
        latest_ai = AIRecommendation.objects.filter(user=user).order_by('-created_at').first()
        ai_data = AIRecommendationSerializer(latest_ai).data if latest_ai else {}

        return Response({
            "user": user_data,
            "profile": profile_data,
            "latest_ai_recommendation": ai_data
        })


class HealthProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user_data = UserSerializer(request.user).data
        try:
            profile = HealthProfile.objects.get(user=request.user)
            profile_data = HealthProfileSerializer(profile).data
        except HealthProfile.DoesNotExist:
            profile_data = {
                'age': None,
                'gender': None,
                'location': None,
                'existing_conditions': []
            }

        return Response({
            **user_data,
            **profile_data
        })

    def post(self, request):
        # Get or create a profile
        profile, _ = HealthProfile.objects.get_or_create(user=request.user)

        # Update user info if provided
        user_data = {
            'email': request.data.get('email', request.user.email),
            'fullName': request.data.get('fullName', request.user.fullName),
        }

        user_serializer = UserSerializer(request.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update/create the health profile
        profile_serializer = HealthProfileSerializer(profile, data=request.data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            **UserSerializer(request.user).data,
            **HealthProfileSerializer(profile).data
        })

class HealthProfileAIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile, _ = HealthProfile.objects.get_or_create(user=user)

        # Update profile first
        serializer = HealthProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()

            # Generate AI recommendations
            ai_result = generate_health_goals(
                age=profile.age,
                gender=profile.gender,
                location=profile.location,
                existing_conditions=profile.existing_conditions,
                full_name=f"{user.first_name} {user.last_name}"
            )

            ai_record = AIRecommendation.objects.create(
                user=user,
                input_data=ai_result["prompt"],
                predicted_risk="Moderate",  # Or real logic later
                suggested_goals=ai_result["output"]
            )

            return Response({
                "profile": HealthProfileSerializer(profile).data,
                "ai_recommendation": AIRecommendationSerializer(ai_record).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GenerateAIRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        try:
            profile = HealthProfile.objects.get(user=user)

            ai_result = generate_health_goals(
                age=profile.age,
                gender=profile.gender,
                location=profile.location,
                existing_conditions=profile.existing_conditions,
                full_name=f"{user.first_name} {user.last_name}"
            )

            recommendation = AIRecommendation.objects.create(
                user=user,
                input_data=ai_result["prompt"],
                predicted_risk="N/A",
                suggested_goals=ai_result["output"]
            )

            serializer = AIRecommendationSerializer(recommendation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except HealthProfile.DoesNotExist:
            return Response({"error": "Health profile not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WalletDeatilView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)
        return Response({
            'balance':wallet.balance,
            'goal':wallet.goal,
            'is_locked':wallet.is_locked,
        })
    

class WalletTopUpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)
        serializer = TransactionSerializer(data=request.data)

        if serializer.is_valid():
            amount = Decimal(request.data.get('amount', 0))

            # Update wallet balance
            wallet.balance += amount
            wallet.save()

            # Create transaction
            transaction = serializer.save(
                user=user,
                wallet=wallet,
                transaction_type='TOP_UP'
            )

            return Response({
                'transaction': TransactionSerializer(transaction).data,
                'new_balance': wallet.balance
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class WalletLockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)

        if wallet.is_locked:
            return Response({'detail': 'Wallet is already locked.'}, status=status.HTTP_400_BAD_REQUEST)

        if not wallet.goal:
            return Response({'error': 'No goal set for this wallet.'}, status=status.HTTP_400_BAD_REQUEST)

        goal_amount = wallet.goal.amount

        if wallet.balance >= goal_amount:
            wallet.is_locked = True
            wallet.save()

            Transaction.objects.create(
                user=user,
                wallet=wallet,
                amount=goal_amount,
                transaction_type='LOCK_FOR_GOAL'
            )

            return Response({'message': 'Wallet locked for goal successfully.', 'locked_amount': goal_amount})
        else:
            return Response({'error': 'Insufficient funds to lock wallet for goal.'}, status=status.HTTP_400_BAD_REQUEST)

        
class WalletPayProvidersView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)

        if wallet.is_locked:
            return Response({'error': 'Wallet is locked. Cannot pay providers.'}, status=status.HTTP_403_FORBIDDEN)

        provider_id = request.data.get('provider_id')
        service_id = request.data.get('service_id')

        try:
            provider = Provider.objects.get(id=provider_id)
            service = ProviderService.objects.get(id=service_id, provider=provider)
        except (Provider.DoesNotExist, ProviderService.DoesNotExist):
            return Response({'error': 'Invalid provider or service.'}, status=status.HTTP_400_BAD_REQUEST)

        if wallet.balance >= service.cost:
            wallet.balance -= service.cost
            wallet.save()

            transaction = Transaction.objects.create(
                user=user,
                wallet=wallet,
                amount=service.cost,
                transaction_type='PAYMENT_TO_PROVIDER',
                description=f'Payment to {provider.name} for {service.name}'
            )

            return Response({
                'message': f'Successfully paid {provider.name} for {service.name}',
                'new_balance': wallet.balance,
                'transaction': TransactionSerializer(transaction).data
            })
        else:
            return Response({'error': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)

class WalletSetGoalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        wallet = get_object_or_404(Wallet, user=request.user)
        try:
            goal_amount = Decimal(request.data.get("goal_amount", 0))
            if goal_amount <= 0:
                return Response({"error": "Goal amount must be a positive number."}, status=400)

            wallet.goal = goal_amount
            wallet.save()

            return Response({
                "message": "Goal set successfully",
                "goal": wallet.goal
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
