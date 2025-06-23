from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from django.http import JsonResponse

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
    ProviderService, AIRecommendationSerializer, WalletSerializer
)


def test_endpoint(request):
    """Simple test endpoint to check if the server is working"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Server is running',
        'database': 'connected'
    })


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
        profile, created = HealthProfile.objects.get_or_create(user=request.user)

        # Prepare data for HealthProfileSerializer including existing_conditions_names
        data = request.data.copy()

        # Handle age field
        if 'age' in data:
            try:
                # Convert to string first to handle any type of input
                age_str = str(data['age']).strip()
                if age_str:  # Only convert if not empty
                    data['age'] = int(age_str)
                else:
                    data['age'] = None
            except (ValueError, TypeError):
                return Response(
                    {"age": "Age must be a valid number."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Handle existing conditions
        if 'existing_conditions' in data and isinstance(data['existing_conditions'], str):
            data['existing_conditions_names'] = [c.strip() for c in data['existing_conditions'].split(',') if c.strip()]
            del data['existing_conditions']

        profile_serializer = HealthProfileSerializer(profile, data=data, partial=True)
        if profile_serializer.is_valid():
            profile = profile_serializer.save()
            return Response(HealthProfileSerializer(profile).data, status=status.HTTP_200_OK)
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                full_name=user.fullName # Use user.fullName
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
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        try:
            # Get the latest AI recommendation for the user
            latest_recommendation = AIRecommendation.objects.filter(user=user).order_by('-created_at').first()
            
            if latest_recommendation:
                serializer = AIRecommendationSerializer(latest_recommendation)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # If no recommendation exists, try to generate one
                try:
                    profile = HealthProfile.objects.get(user=user)
                    return self._generate_recommendation(user, profile)
                except HealthProfile.DoesNotExist:
                    return Response(
                        {"error": "Please complete your health profile first."}, 
                        status=status.HTTP_404_NOT_FOUND
                    )

        except Exception as e:
            print(f"Error in AI recommendation GET: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        user = request.user
        try:
            profile = HealthProfile.objects.get(user=user)
            return self._generate_recommendation(user, profile)
        except HealthProfile.DoesNotExist:
            return Response(
                {"error": "Please complete your health profile first."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error in AI recommendation POST: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _generate_recommendation(self, user, profile):
        """Helper method to generate AI recommendations"""
        try:
            ai_result = generate_health_goals(
                age=profile.age,
                gender=profile.gender,
                location=profile.location,
                existing_conditions=profile.existing_conditions,
                full_name=user.fullName
            )

            recommendation = AIRecommendation.objects.create(
                user=user,
                input_data=ai_result["prompt"],
                predicted_risk="Moderate",  # You can make this dynamic based on the AI result
                suggested_goals=ai_result["output"]
            )

            serializer = AIRecommendationSerializer(recommendation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error generating AI recommendation: {str(e)}")
            return Response(
                {"error": "Failed to generate AI recommendation. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
        user = request.user
        wallet = get_object_or_404(Wallet, user=user)
        serializer = WalletSerializer(wallet, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "Welcome to the Contact Page!"}, status=status.HTTP_200_OK)

    def post(self, request):
        # Here you would typically process contact form submissions (e.g., send an email)
        # For now, let's just acknowledge receipt.
        name = request.data.get('name', 'Guest')
        email = request.data.get('email', 'N/A')
        message = request.data.get('message', 'No message')
        print(f"Contact form submission from {name} ({email}): {message}")
        return Response({"message": "Your message has been received!"}, status=status.HTTP_200_OK)
