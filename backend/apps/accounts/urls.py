from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.me_view, name='me'),
    path('agents/', views.agents_list, name='agents'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]
