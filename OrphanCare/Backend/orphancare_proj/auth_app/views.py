# auth_app/views.py
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.utils import timezone
from .models import User, OTP
from .serializers import RegisterSerializer, VerifyOTPSerializer, UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User, OTP
from .serializers import RegisterSerializer, VerifyOTPSerializer
from .utils import send_otp_email
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterAPIView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        otp = OTP.create_otp_for_user(user)
        # send OTP email
        send_otp_email(user.email, otp.code)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {
            "message": "User created. An OTP has been sent to your registered email for verification."
        }
        return response



class VerifyOTPAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        otp = serializer.validated_data["otp"]
        # mark otp used and activate user
        otp.used = True
        otp.save()
        user.is_verified = True
        user.is_active = True
        user.save()
        return Response({"message": "OTP verified, account activated"}, status=status.HTTP_200_OK)


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
