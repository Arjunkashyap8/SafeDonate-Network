from django.urls import path
from .views import OrphanageProfileCreateView, OrphanageProfileDetailView,OrphanageListView,OrphanageProfilePublicView

urlpatterns = [
    path('create/', OrphanageProfileCreateView.as_view(), name='orphanage-create'),
    path('me/', OrphanageProfileDetailView.as_view(), name='orphanage-detail'),
    path('list/', OrphanageListView.as_view(), name='orphanage-list'),
    path("<int:pk>/", OrphanageProfilePublicView.as_view(), name="orphanage-public-detail"),

]
