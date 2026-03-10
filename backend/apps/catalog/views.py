from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CatalogItem
from .serializers import CatalogItemSerializer

class CatalogItemViewSet(viewsets.ModelViewSet):
    queryset = CatalogItem.objects.all()
    serializer_class = CatalogItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get('active'):
            qs = qs.filter(active=True)
        return qs
