# auth_app/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import User, OTP
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role  # adds role inside JWT itself
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra fields in response body
        data['role'] = self.user.role

        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ("email", "password", "role")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        # keep inactive until OTP verification if you want:
        user.is_active = False
        user.is_verified = False
        user.save()
        return user


class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=8)


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=8)

    def validate(self, attrs):
        email = attrs.get("email")
        code = attrs.get("code")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        # find OTP
        otp_qs = OTP.objects.filter(user=user, code=code, used=False).order_by("-created_at")
        if not otp_qs.exists():
            raise serializers.ValidationError("Invalid code")
        otp = otp_qs.first()
        if otp.is_expired():
            raise serializers.ValidationError("OTP expired")
        attrs["user"] = user
        attrs["otp"] = otp
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "phone", "role", "is_verified", "is_active")
        read_only_fields = ("email", "id", "is_verified", "is_active")
