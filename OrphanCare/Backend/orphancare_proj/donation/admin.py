from django.contrib import admin
from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "item_name",
        "donor",
        "orphanage",
        "quantity",
        "status",
        "donation_date",
    )

    list_filter = ("status", "donation_date", "orphanage")  # <-- FILTERS HERE

    search_fields = (
        "item_name",
        "donor__user__email",
        "orphanage__orphanage_name",
    )

    ordering = ("-donation_date",)
