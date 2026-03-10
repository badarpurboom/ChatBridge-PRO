from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('pipeline-stages', views.PipelineStageViewSet, basename='stage')

urlpatterns = [
    path('', include(router.urls)),
]
