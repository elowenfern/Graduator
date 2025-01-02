from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CollegeDetail, 
    # CollegeCreateView, 
    CollegeViewSet, 
    CollegeImageViewSet,
    CourseViewSet, 
    UniversityViewSet,
    # CollegeSearchView,
    # CollegeList,
    LoginView,
    CollegeListView,
    send_whatsapp,
    SectionViewSet,
    unique_locations,
    colleges_by_section,
    colleges_by_location,
    get_course_categories,
    course_by_category,
    AddCourseToCollegeView,
    PopularCoursesViewSet,
    BlogViewSet,
    increment_course_view,
    InquiryViewSet
)


router = DefaultRouter()
router.register(r'colleges', CollegeViewSet)
# router.register(r'college-images', CollegeImageViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'universities', UniversityViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'inquiries', InquiryViewSet)

# router.register(r'facilities', FacilityViewSet)

popular_courses_viewset = PopularCoursesViewSet.as_view({"get": "list"})

urlpatterns = [
    path('', include(router.urls)),
    # path('search/',search_colleges,name='search_colleges'),
    path('send-whatsapp/', send_whatsapp, name='send_whatsapp'), 
   
    path('college/', CollegeListView.as_view(), name='college-list'),
    # path('colleges/', CollegeList.as_view(), name='college-list'),
    path('editcolleges/<int:pk>/', CollegeDetail.as_view(), name='college-detail'),
   
    path('login/', LoginView.as_view(), name='admin_login'),

    path('courses/<int:pk>/increment_view/', increment_course_view, name='increment-course-view'),
    path('course-categories/', get_course_categories, name='course_categories'),
    path('course_category/', course_by_category, name='course_by_category'),
    path('popular-courses/', popular_courses_viewset),
    path('college_courses/<int:pk>/', AddCourseToCollegeView.as_view(), name='add_college_course'),


    path('sections/<str:section_name>/colleges/', colleges_by_section, name='colleges_by_section'),
    path('locations/', unique_locations, name='unique_locations'),
    path('locations/<str:location>/colleges/', colleges_by_location, name='colleges_by_location'),
   
   
   
]
