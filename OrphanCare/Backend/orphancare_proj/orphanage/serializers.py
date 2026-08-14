from rest_framework import serializers
from .models import OrphanageProfile

class OrphanageProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrphanageProfile
        fields = [
            "id", "user", "orphanage_name", "description",
            "address", "city", "state", "pincode", "phone_number",
            "email", "total_orphans", "boys_count", "girls_count", 
            "students_count", "registration_no", "website", "verified","banner_image","established_on","email"
        ]       
        read_only_fields = ["user", "verified"]


class OrphanageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrphanageProfile
        fields = [
            "id",
            "orphanage_name",
            "description",
            "city",
            "state",
            "total_orphans",
            "boys_count",
            "girls_count",
            "students_count",
            "banner_image",
            "verified",
            "pincode"
        ]
