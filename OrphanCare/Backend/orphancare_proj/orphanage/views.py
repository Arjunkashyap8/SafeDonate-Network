from rest_framework import generics, permissions
from .models import OrphanageProfile
from .serializers import OrphanageProfileSerializer,OrphanageListSerializer,OrphanageProfileSerializer
from rest_framework.permissions import AllowAny



class OrphanageProfileCreateView(generics.CreateAPIView):
    serializer_class = OrphanageProfileSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrphanageProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrphanageProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return OrphanageProfile.objects.get(user=self.request.user)



class OrphanageListView(generics.ListAPIView):
    queryset = OrphanageProfile.objects.all()
    serializer_class = OrphanageListSerializer
    permission_classes = [AllowAny]



class OrphanageProfilePublicView(generics.RetrieveAPIView):
    queryset = OrphanageProfile.objects.all()
    serializer_class = OrphanageProfileSerializer
    permission_classes = [permissions.AllowAny]
