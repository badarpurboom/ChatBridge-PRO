from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if not user or not user.is_active:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
    except Exception:
        pass
    return Response({'detail': 'Logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def agents_list(request):
    """List all active team members (admin, manager, agent)"""
    if not request.user.is_admin:
        return Response({'error': 'Forbidden'}, status=403)
    # Fetch all active users except the current admin
    agents = User.objects.filter(is_active=True).exclude(id=request.user.id)
    # Also fetch the current admin so they are in the list
    all_users = list(User.objects.filter(id=request.user.id)) + list(agents)
    return Response(UserSerializer(all_users, many=True).data)


class RegisterView(generics.CreateAPIView):
    """Admin only — create new agent"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_admin:
            raise PermissionError('Admin only')
        serializer.save()


class UserDetailView(generics.DestroyAPIView):
    """Admin only — delete a user"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if not self.request.user.is_admin:
            raise PermissionError('Admin only')
        if getattr(instance, 'is_superuser', False) or instance.username == 'admin':
            raise PermissionError('Cannot delete main admin')
        instance.delete()
