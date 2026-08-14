from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source="donor.full_name", read_only=True)
    orphanage_name = serializers.CharField(source="orphanage.orphanage_name", read_only=True)

    class Meta:
        model = Donation
        fields = [
            "id", "donor", "donor_name", "orphanage", "orphanage_name",
            "item_name", "description", "quantity", "status",
            "donation_date", "proof_image"
        ]
        read_only_fields = ["donor","donation_date"]


class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source="donor.full_name", read_only=True)
    orphanage_name = serializers.CharField(source="orphanage.orphanage_name", read_only=True)
    donor_phone = serializers.CharField(source = "donor.contact_number", read_only=True)
    donor_email = serializers.EmailField(source="donor.email",read_only=True)
    requirement_item = serializers.CharField(
        source="requirement.item_name", read_only=True
    )

    class Meta:
        model = Donation
        fields = [
            "id",
            "donor",
            "donor_name",
            "donor_phone",
            "donor_email",
            "orphanage",
            "orphanage_name",
            "requirement",
            "requirement_item",
            "item_name",
            "description",
            "quantity",
            "status",
            "donation_date",
            "proof_image",
        ]
        read_only_fields = ["donation_date", "donor"]
