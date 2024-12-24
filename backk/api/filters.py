# filters.py
import django_filters
from .models import Course


class CourseFilter(django_filters.FilterSet):
    # Allow filtering by the category choices from the Course model
    category = django_filters.ChoiceFilter(choices=Course.CATEGORY_CHOICES)

    class Meta:
        model = Course
        fields = ['category']
