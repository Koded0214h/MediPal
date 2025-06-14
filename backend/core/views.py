from django.shortcuts import get_object_or_404
from django.contrib.auth import logout

from decimal import Decimal

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

from .models import (
    CustomUser, HealthProfile, Wallet,
    Transaction,Provider
)
from .serializers import (
    UserSerializer, HealthProfileSerializer, TransactionSerializer,
    ProviderService
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
                user.save()

            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(username=username)
            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'username': user.username,
                    'email': user.email
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

        response_data = {
            **user_data,
            'age': profile_data.get('age'),
            'gender': profile_data.get('gender'),
            'location': profile_data.get('location'),
            'existing_conditions': profile_data.get('existing_conditions', [])
        }

        return Response(response_data)

    def put(self, request):
        try:
            profile = HealthProfile.objects.get(user=request.user)
        except HealthProfile.DoesNotExist:
            # Create new profile with required fields
            profile = HealthProfile.objects.create(
                user=request.user,
                age=request.data.get('age', 0),  # Default to 0 if not provided
                gender=request.data.get('gender', 'male'),  # Default to male if not provided
                location=request.data.get('location', '')  # Default to empty string if not provided
            )

        # Update user
        user_data = {
            'username': request.data.get('username'),
            'email': request.data.get('email')
        }
        user_serializer = UserSerializer(request.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update profile
        profile_data = {
            'age': request.data.get('age'),
            'gender': request.data.get('gender'),
            'location': request.data.get('location'),
            'existing_conditions': request.data.get('existing_conditions')
        }
        profile_serializer = HealthProfileSerializer(profile, data=profile_data, partial=True)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Merge updated data
        updated_user_data = UserSerializer(request.user).data
        updated_profile_data = HealthProfileSerializer(profile).data

        response_data = {
            **updated_user_data,
            'age': updated_profile_data.get('age'),
            'gender': updated_profile_data.get('gender'),
            'location': updated_profile_data.get('location'),
            'existing_conditions': updated_profile_data.get('existing_conditions', [])
        }

        return Response(response_data)

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
