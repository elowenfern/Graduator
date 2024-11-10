from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CollegeDetail, 
    CollegeCreateView, 
    CollegeViewSet, 
    CollegeImageViewSet,
    CourseViewSet, 
    UniversityViewSet,
    FacilityViewSet,
    CollegeList,
    LoginView
)


router = DefaultRouter()
router.register(r'colleges', CollegeViewSet)
router.register(r'college-images', CollegeImageViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'universities', UniversityViewSet)
router.register(r'facilities', FacilityViewSet)



urlpatterns = [
    path('colleges/', CollegeList.as_view(), name='college-list'),
    path('editcolleges/<int:pk>/', CollegeDetail.as_view(), name='college-detail'),
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='admin_login'),
]
