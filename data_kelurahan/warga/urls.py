from django.urls import path
from .views import WargaDetailView
from .views import WargaListView

urlpatterns = [
    path('', WargaListView.as_view(), name='warga-list'),
    path('<int:pk>/', WargaDetailView.as_view(), name='warga-detail'),
]
