from rest_framework import generics, permissions
from .models import Donation
from .serializers import DonationSerializer
from donor.models import DonorProfile
from orphanage.models import OrphanageProfile
import logging
from auth_app.utils import send_donation_created_email
from donation.utils import send_donation_accepted_email
import logging

# ------------------ DONOR VIEWS ------------------

logger = logging.getLogger(__name__)


class DonationCreateView(generics.CreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        donor_profile = DonorProfile.objects.get(user=self.request.user)

        orphanage_id = self.request.data.get("orphanage")
        orphanage = OrphanageProfile.objects.get(id=orphanage_id)

        requirement = serializer.validated_data.get("requirement")

        donation = serializer.save(
            donor=donor_profile,
            orphanage=orphanage,
            item_name=(
                requirement.item_name
                if requirement
                else serializer.validated_data.get("item_name")
            ),
        )

        # 🔔 Best-effort email (never breaks API)
        try:
            send_donation_created_email(
                orphanage=orphanage,
                donor=donor_profile,
                donation=donation,
            )
        except Exception as e:
            logger.error("Unexpected error while sending donation email: %s", str(e))


# class DonationCreateView(generics.CreateAPIView):
#     serializer_class = DonationSerializer
#     permission_classes = [permissions.AllowAny]

#     def perform_create(self, serializer):
#         donor_profile = DonorProfile.objects.get(user=self.request.user)

#         requirement = serializer.validated_data.get("requirement")

#         orphanage_id = self.request.data.get("orphanage")
#         orphanage = OrphanageProfile.objects.get(id=orphanage_id)

#         serializer.save(
#             donor=donor_profile,
#             orphanage=orphanage,
#             item_name=requirement.item_name if requirement else serializer.validated_data.get("item_name"),
#         )



class DonorDonationListView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        donor_profile = DonorProfile.objects.get(user=self.request.user)
        return Donation.objects.filter(donor=donor_profile).order_by("-donation_date")


# ------------------ ORPHANAGE VIEWS ------------------

class OrphanageDonationListView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        orphanage_profile = OrphanageProfile.objects.get(user=self.request.user)
        return Donation.objects.filter(orphanage=orphanage_profile).order_by("-donation_date")


logger = logging.getLogger(__name__)


class DonationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Donation.objects.all()

    def perform_update(self, serializer):
        donation = self.get_object()
        previous_status = donation.status

        updated_donation = serializer.save()

        # 🔔 Send mail ONLY when accepted
        if previous_status != "accepted" and updated_donation.status == "accepted":
            try:
                send_donation_accepted_email(updated_donation)
            except Exception as e:
                logger.error(
                    "Unexpected error while sending donation accepted email: %s",
                    str(e),
                )