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
        fields = ['email', 'fullName', 'phoneNumber', 'country', 'countryCode', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'default': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            fullName=validated_data['fullName'],
            phoneNumber=validated_data['phoneNumber'],
            country=validated_data['country'],
            countryCode=validated_data['countryCode'],
            password=validated_data['password'],
            is_active=True
        )
        return user


class HealthProfileSerializer(serializers.ModelSerializer):
    existing_conditions = ConditionSerializer(many=True, read_only=True)
    existing_conditions_names = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)

    class Meta:
        model = HealthProfile
        fields = ['id', 'user', 'age', 'gender', 'location', 'existing_conditions', 'existing_conditions_names']
        read_only_fields = ['id', 'user', 'existing_conditions']

    def validate_gender(self, value):
        """Validate gender field"""
        if value and value not in ['Male', 'Female', 'Other']:
            raise serializers.ValidationError("Gender must be one of: Male, Female, Other")
        return value

    def create(self, validated_data):
        existing_conditions_names = validated_data.pop('existing_conditions_names', [])
        health_profile = HealthProfile.objects.create(**validated_data)
        for condition_name in existing_conditions_names:
            condition, _ = Condition.objects.get_or_create(name=condition_name)
            health_profile.existing_conditions.add(condition)
        return health_profile

    def update(self, instance, validated_data):
        existing_conditions_names = validated_data.pop('existing_conditions_names', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if existing_conditions_names is not None:
            instance.existing_conditions.clear()
            for condition_name in existing_conditions_names:
                condition, _ = Condition.objects.get_or_create(name=condition_name)
                instance.existing_conditions.add(condition)
        return instance


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
