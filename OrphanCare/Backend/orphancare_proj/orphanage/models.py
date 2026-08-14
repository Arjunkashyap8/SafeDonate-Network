from django.db import models
from django.conf import settings

class OrphanageProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orphanage_profile"
    )
    orphanage_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    established_on = models.DateField(null=True)

    # Counts
    total_orphans = models.PositiveIntegerField(default=0)
    boys_count = models.PositiveIntegerField(default=0)
    girls_count = models.PositiveIntegerField(default=0)
    students_count = models.PositiveIntegerField(default=0)

    # Extra info
    registration_no = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    # NEW: Banner Image
    banner_image = models.ImageField(upload_to="orphanage_banners/", blank=True, null=True)

    def __str__(self):
        return f"{self.orphanage_name} - {self.id}"
