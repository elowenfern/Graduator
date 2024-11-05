from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollegeList, LoginView, CollegeDetail, CollegeCreateView, CollegeImageViewSet

router = DefaultRouter()
router.register(r'college-images', CollegeImageViewSet, basename='college-image')  # Use a direct route for images

urlpatterns = [
    path('colleges/', CollegeList.as_view(), name='college-list'),
    path('editcolleges/<int:pk>/', CollegeDetail.as_view(), name='college-detail'),
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='admin_login'),
    path('create-college/', CollegeCreateView.as_view(), name='college-create'),  # Renamed to avoid conflict
]
