from rest_framework import serializers
from .models import OrphanageRequirement

class OrphanageRequirementSerializer(serializers.ModelSerializer):
    orphanage_name = serializers.CharField(source="orphanage.orphanage_name", read_only=True)

    class Meta:
        model = OrphanageRequirement
        fields = [
            "id", "orphanage", "orphanage_name",
            "item_name", "category", "description",
            "quantity_needed", "quantity_received",
            "posted_date", "deadline", "is_fulfilled"
        ]
        read_only_fields = ["orphanage", "posted_date", "quantity_received", "is_fulfilled"]
