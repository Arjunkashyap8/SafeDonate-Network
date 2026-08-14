from django.db import models
from django.conf import settings
from orphanage.models import OrphanageProfile
from donor.models import DonorProfile
from requirement.models import OrphanageRequirement

class Donation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    donor = models.ForeignKey(
        DonorProfile, on_delete=models.CASCADE, related_name="donations"
    )
    orphanage = models.ForeignKey(
        OrphanageProfile, on_delete=models.CASCADE, related_name="donations"
    )

    requirement = models.ForeignKey(
        OrphanageRequirement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations"
    )

    item_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    quantity = models.PositiveIntegerField(default=1)
    donation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # Proof or note
    proof_image = models.ImageField(upload_to="donation_proofs/", blank=True, null=True)

    def __str__(self):
        return f"{self.item_name} by {self.donor.user.email} to {self.orphanage.orphanage_name}"
