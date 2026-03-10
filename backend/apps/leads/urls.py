from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('leads', views.LeadViewSet, basename='lead')
router.register('lead-fields', views.LeadFieldViewSet, basename='leadfield')
router.register('settings', views.SettingViewSet, basename='setting')

urlpatterns = [
    path('', include(router.urls)),
]
