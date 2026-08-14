from django.urls import path
from .views import DonorProfileCreateView, DonorProfileDetailView

urlpatterns = [
    path('create/', DonorProfileCreateView.as_view(), name='donor-create'),
    path('me/', DonorProfileDetailView.as_view(), name='donor-detail'),
]
