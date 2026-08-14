from rest_framework import serializers
from .models import DonorProfile

class DonorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorProfile
        fields = [
            "id", "user", "full_name", "contact_number", "email",
            "address", "city", "state", "pincode",
            "occupation", "organization_name", "is_verified"
        ]
        read_only_fields = ["user", "is_verified"]
