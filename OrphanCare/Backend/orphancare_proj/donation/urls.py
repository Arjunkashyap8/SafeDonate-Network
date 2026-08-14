from django.urls import path
from .views import (
    DonationCreateView,
    DonorDonationListView,
    OrphanageDonationListView,
    DonationStatusUpdateView,
)

urlpatterns = [
    path("create/", DonationCreateView.as_view(), name="donation-create"),
    path("my-donations/", DonorDonationListView.as_view(), name="donor-donations"),
    path("received/", OrphanageDonationListView.as_view(), name="orphanage-donations"),
    path("<int:pk>/update-status/", DonationStatusUpdateView.as_view(), name="donation-status-update"),
]
