from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, fullName, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, fullName=fullName, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, fullName, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, fullName, password, **extra_fields)


class CustomUser(AbstractUser):
    # Remove username field
    username = None
    
    # New fields
    fullName = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phoneNumber = models.CharField(max_length=15)
    country = models.CharField(max_length=100)
    countryCode = models.CharField(max_length=5)  # e.g., +234, +1, etc.
    is_circle_admin = models.BooleanField(default=False)

    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullName', 'phoneNumber', 'country', 'countryCode']

    objects = CustomUserManager()

    groups = models.ManyToManyField(Group, related_name='customuser_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions', blank=True)

    def __str__(self):
        return self.email

class Condition(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class HealthProfile(models.Model):
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female')]

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    location = models.CharField(max_length=255)
    existing_conditions = models.ManyToManyField(Condition, blank=True)

    def __str__(self):
        return f'{self.user.fullName} @ {self.location}'


class HealthGoal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    description = models.TextField()
    monthly_target = models.IntegerField()
    risk_level = models.FloatField()
    duration = models.DateField()

    def __str__(self):
        return f'{self.title} by {self.user.fullName}'


class Wallet(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    goal = models.ForeignKey(HealthGoal, on_delete=models.CASCADE, null=True, blank=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_locked = models.BooleanField(default=False)
    unlock_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.fullName} - ₦{self.balance}'


class Transaction(models.Model):
    TRANS_TYPE = [('deposit', 'Deposit'), ('emergency', 'Emergency')]
    STATUS = [('success', 'Success'), ('pending', 'Pending'), ('failed', 'Failed')]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TRANS_TYPE)
    status = models.CharField(max_length=20, choices=STATUS)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.amount} / {self.status} / {self.wallet.user.fullName}'


class ProviderService(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Provider(models.Model):
    CATEGORY_CHOICES = [('pharmacy', 'Pharmacy'), ('hospital', 'Hospital'), ('lab', 'Laboratory')]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    location = models.TextField()
    approved = models.BooleanField(default=False)
    contact = models.CharField(max_length=15)
    services = models.ManyToManyField(ProviderService, blank=True)

    def __str__(self):
        return f'{self.name} @ {self.location}'


class CommunityCircle(models.Model):
    name = models.CharField(max_length=50)
    members = models.ManyToManyField(CustomUser)
    wallets = models.ManyToManyField(Wallet, blank=True)
    join_code = models.CharField(max_length=10, unique=True)
    admin_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='admin_circles')

    def __str__(self):
        return f'{self.name} (Admin: {self.admin_user.fullName})'


class Nudge(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    suggested_amount = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Nudge for {self.user.fullName}: {self.message[:30]}'


class AIRecommendation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    input_data = models.TextField()
    suggested_goals = models.TextField()
    predicted_risk = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'AI Rec for {self.user.fullName} on {self.created_at.strftime("%Y-%m-%d")}'
