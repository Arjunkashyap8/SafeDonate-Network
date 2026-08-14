from rest_framework import generics, permissions
from .models import OrphanageRequirement
from .serializers import OrphanageRequirementSerializer
from orphanage.models import OrphanageProfile

# ------------------ ORPHANAGE VIEWS ------------------

class OrphanageRequirementCreateView(generics.CreateAPIView):
    serializer_class = OrphanageRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        orphanage_profile = OrphanageProfile.objects.get(user=self.request.user)
        serializer.save(orphanage=orphanage_profile)


class OrphanageRequirementListView(generics.ListAPIView):
    serializer_class = OrphanageRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        orphanage_profile = OrphanageProfile.objects.get(user=self.request.user)
        return OrphanageRequirement.objects.filter(orphanage=orphanage_profile).order_by("-posted_date")


class OrphanageRequirementUpdateView(generics.UpdateAPIView):
    serializer_class = OrphanageRequirementSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = OrphanageRequirement.objects.all()

    def perform_update(self, serializer):
        orphanage_profile = OrphanageProfile.objects.get(user=self.request.user)
        requirement = self.get_object()
        if requirement.orphanage != orphanage_profile:
            raise PermissionError("You are not authorized to update this requirement.")
        serializer.save()


class OrphanageRequirementDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = OrphanageRequirement.objects.all()

    def perform_destroy(self, instance):
        orphanage_profile = OrphanageProfile.objects.get(user=self.request.user)
        if instance.orphanage != orphanage_profile:
            raise PermissionError("You are not authorized to delete this requirement.")
        instance.delete()


# ------------------ DONOR VIEW ------------------

class PublicRequirementListView(generics.ListAPIView):
    """Donors can view all active / unfulfilled requirements."""
    serializer_class = OrphanageRequirementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return OrphanageRequirement.objects.filter(is_fulfilled=False).order_by("-posted_date")


# requirements/views.py
class OrphanageRequirementByOrphanageView(generics.ListAPIView):
    serializer_class = OrphanageRequirementSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        orphanage_id = self.kwargs["orphanage_id"]
        return OrphanageRequirement.objects.filter(
            orphanage_id=orphanage_id,
            is_fulfilled=False
        ).order_by("-posted_date")
