from rest_framework.pagination import PageNumberPagination

class CoursePagination(PageNumberPagination):
    page_size = 8  # Set the number of items per page
    page_size_query_param = 'page_size'  # Allow client to change page size via query parameter
    max_page_size = 100  # Limit the maximum page size to 100 items
