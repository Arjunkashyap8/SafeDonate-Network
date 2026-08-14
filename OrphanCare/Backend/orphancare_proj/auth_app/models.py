# auth_app/models.py
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.utils import timezone
import uuid
import random

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_verified", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Account table: email (unique) + password.
    Additional fields for profile completion (first_name, last_name, phone, role).
    is_verified toggled after OTP verification.
    Role can be 'donor' or 'orphanage' (and possibly 'admin').
    """
    ROLE_CHOICES = (
        ("donor", "Donor"),
        ("orphanage", "Orphanage"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=120, blank=True)
    last_name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)  # enable after verify if you want
    is_verified = models.BooleanField(default=False)  # OTP verified
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class OTP(models.Model):
    """
    Simple OTP model for verification.
    """
    user = models.ForeignKey(User, related_name="otps", on_delete=models.CASCADE)
    code = models.CharField(max_length=8)  # store as string for leading zeros
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expires_at

    @classmethod
    def create_otp_for_user(cls, user, minutes_valid=10):
        import datetime
        code = f"{random.randint(0, 999999):06d}"
        expires_at = timezone.now() + datetime.timedelta(minutes=minutes_valid)
        otp = cls.objects.create(user=user, code=code, expires_at=expires_at)
        return otp
