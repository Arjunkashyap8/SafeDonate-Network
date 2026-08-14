from django.db import models
from orphanage.models import OrphanageProfile

class OrphanageRequirement(models.Model):
    CATEGORY_CHOICES = [
        ("food", "Food"),
        ("groceries", "Groceries"),
        ("clothing", "Clothing"),
        ("education", "Education"),
        ("medical", "Medical"),
        ("others", "Others"),
        ("stationary","Stationary")
    ]

    orphanage = models.ForeignKey(
        OrphanageProfile, on_delete=models.CASCADE, related_name="requirements"
    )
    item_name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="others")
    description = models.TextField(blank=True, null=True)
    quantity_needed = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(default=0)
    posted_date = models.DateTimeField(auto_now_add=True)
    deadline = models.DateField(blank=True, null=True)
    is_fulfilled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.item_name} ({self.orphanage.orphanage_name})"
