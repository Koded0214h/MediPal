from django.urls import path
from django.http import JsonResponse

from . import views

def api_root(request):
    return JsonResponse({
        'message': 'MediPal API is running successfully!',
        'status': 'connected',
        'endpoints': {
            'register': '/api/register/',
            'login': '/api/login/',
            'dashboard': '/api/dashboard/',
            'health_profile': '/api/health-profile/',
            'wallet': '/api/wallet/',
            'contact': '/api/contact/',
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('health-profile/', views.HealthProfileView.as_view(), name='health_profile'),
    path('health-profile/ai/', views.HealthProfileAIView.as_view(), name='health_profile_ai'),
    path('ai-recommendation/', views.GenerateAIRecommendationView.as_view(), name='ai_recommendation'),
    path('wallet/', views.WalletDeatilView.as_view(), name='wallet_detail'),
    path('wallet/topup/', views.WalletTopUpView.as_view(), name='wallet_topup'),
    path('wallet/lock/', views.WalletLockView.as_view(), name='wallet_lock'),
    path('wallet/pay/', views.WalletPayProvidersView.as_view(), name='wallet_pay'),
    path('wallet/set-goal/', views.WalletSetGoalView.as_view(), name='set_wallet_goal'),
    path('contact/', views.ContactView.as_view(), name='contact'),
]

