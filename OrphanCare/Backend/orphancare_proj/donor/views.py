from rest_framework import generics, permissions
from .models import DonorProfile
from .serializers import DonorProfileSerializer

class DonorProfileCreateView(generics.CreateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DonorProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return DonorProfile.objects.get(user=self.request.user)
