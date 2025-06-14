from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class CustomUser(AbstractUser):
    username = models.CharField(max_length=40, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    is_circle_admin = models.BooleanField(default=False)

    groups = models.ManyToManyField(Group, related_name='customuser_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_permissions', blank=True)

    def __str__(self):
        return self.username


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
        return f'{self.user.username} @ {self.location}'


class HealthGoal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    description = models.TextField()
    monthly_target = models.IntegerField()
    risk_level = models.FloatField()
    duration = models.DateField()

    def __str__(self):
        return f'{self.title} by {self.user.username}'


class Wallet(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    goal = models.ForeignKey(HealthGoal, on_delete=models.CASCADE, null=True, blank=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_locked = models.BooleanField(default=False)
    unlock_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - ₦{self.balance}'


class Transaction(models.Model):
    TRANS_TYPE = [('deposit', 'Deposit'), ('emergency', 'Emergency')]
    STATUS = [('success', 'Success'), ('pending', 'Pending'), ('failed', 'Failed')]

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TRANS_TYPE)
    status = models.CharField(max_length=20, choices=STATUS)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.amount} / {self.status} / {self.wallet.user.username}'


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
        return f'{self.name} (Admin: {self.admin_user.username})'


class Nudge(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    suggested_amount = models.IntegerField(default=0)
    date = models.DateField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Nudge for {self.user.username}: {self.message[:30]}'


class AIRecommendation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    input_data = models.JSONField()
    predicted_risks = models.JSONField()
    suggested_goals = models.JSONField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'AI Rec for {self.user.username} on {self.date}'
