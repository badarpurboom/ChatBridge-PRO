from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API routes
    path('api/auth/', include('apps.accounts.urls')),
    path('api/', include('apps.leads.urls')),
    path('api/', include('apps.pipeline.urls')),
    path('api/', include('apps.catalog.urls')),
    path('api/wa/', include('apps.whatsapp.urls')),

    # Internal webhook (called by wa-service Node.js)
    path('internal/', include('apps.whatsapp.internal_urls')),

    # Baileys session sync
    path('wa-baileys/', include('apps.wa_baileys.urls')),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
