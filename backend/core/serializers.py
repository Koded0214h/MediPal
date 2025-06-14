from rest_framework import serializers
from .models import (
    CustomUser, HealthProfile, HealthGoal, Wallet,
    Transaction, Provider, CommunityCircle, Nudge,
    AIRecommendation, Condition, ProviderService
)

# ---------------------
# BASIC/NESTED SERIALIZERS
# ---------------------

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id', 'name']


class ProviderServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderService
        fields = ['id', 'name']


# ---------------------
# MAIN SERIALIZERS
# ---------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'default': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            password=validated_data['password'],
            is_active=True
        )
        return user


class HealthProfileSerializer(serializers.ModelSerializer):
    existing_conditions = ConditionSerializer(many=True, read_only=True)

    class Meta:
        model = HealthProfile
        fields = '__all__'


class HealthGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthGoal
        fields = '__all__'


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'
        read_only_fields = ['created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['date']


class ProviderSerializer(serializers.ModelSerializer):
    services = ProviderServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Provider
        fields = '__all__'


class CommunitySerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    wallets = WalletSerializer(many=True, read_only=True)
    admin_user = UserSerializer(read_only=True)

    class Meta:
        model = CommunityCircle
        fields = '__all__'


class NudgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nudge
        fields = '__all__'
        read_only_fields = ['date']


class AIRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIRecommendation
        fields = '__all__'
        read_only_fields = ['date']
