# api/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import College, CollegeImage,Facility,Course,University,Section,CollegeCourse,Blog,Inquiry

from .serializer import CollegeSerializer, CollegeImageSerializer,CourseSerializer,UniversitySerializer,SectionSerializer,CollegeCourseSerializer,BlogSerializer,InquirySerializer
# from .pagination import CoursePagination
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from rest_framework import status
# from rest_framework.viewsets import ViewSet
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from django.db.models import Q

# from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.exceptions import ValidationError
import json
from django.shortcuts import get_list_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.conf import settings
import logging
import environ
import os
from django.db import transaction





env = environ.Env()
environ.Env.read_env(env_file='.env')


# # Fetch the correct credentials from the .env file
TWILIO_ACCOUNT_SID = env('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = env('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = env('TWILIO_PHONE_NUMBER')
ADMIN_PHONE = env('ADMIN_PHONE')





# Twilio credentials (replace these with your actual credentials)
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
try:
    message = client.messages.create(
        body="Hello from Django!",
        from_=TWILIO_PHONE_NUMBER,
        to=ADMIN_PHONE
    )
    print(f"Message sent successfully! SID: {message.sid}")
except Exception as e:
    print(f"Error sending message: {e}")
    print(f"Error details: {e.code} - {e.msg}")





client = Client(env('TWILIO_ACCOUNT_SID'), env('TWILIO_AUTH_TOKEN'))

@csrf_exempt
def send_whatsapp(request):
    if request.method == "POST":
        try:
            
            data = json.loads(request.body.decode('utf-8'))
            print("Received data:", data)

            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            message = data.get('message')
            course = data.get('course')
            college = data.get('college')

            print(f"Name: {name}, Email: {email}, Phone: {phone}, Message: {message}, Course: {course}, College: {college}")
            # Save inquiry to the database
            inquiry = Inquiry.objects.create(
                name=name,
                email=email,
                phone=phone,
                message=message,
                course=course,
                college=college
            )
            print(f"Inquiry saved: {inquiry}")
            # Construct the WhatsApp message
            message_body = f"""
            New inquiry received:
            Name: {name}
            Email: {email}
            Phone: {phone}
            Message: {message}
            Interested Course: {course}
            College: {college}
            """
            print(f"Message body: {message_body}")

            # Send WhatsApp message
            message = client.messages.create(
                body=message_body,
                from_=TWILIO_PHONE_NUMBER,
                to=ADMIN_PHONE
            )
            print(f"Message sent to: {ADMIN_PHONE} using Twilio phone: {TWILIO_PHONE_NUMBER}")
            print(f"Twilio SID: {message.sid}")
            
            return JsonResponse({"message": "Message sent successfully!", "sid": message.sid}, status=200)

        except json.JSONDecodeError:
            print("Error: Invalid JSON data.")
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        
        except TwilioRestException as e:
            print(f"Twilio API error: {e.msg}")
            return JsonResponse({"error": "Failed to send WhatsApp message."}, status=500)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({"error": "An error occurred."}, status=500)
    else:
        print("Error: Invalid request method.")
        return JsonResponse({"error": "Invalid request method."}, status=400)



class InquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquirySerializer


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)


            user = authenticate(username=user.username, password=password)

            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'access': token.key,  'message': 'Login successful'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            print(e)  # This will show in the terminal running the Django server
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





# class CollegeList(generics.ListCreateAPIView):
#     queryset = College.objects.all()
#     serializer_class = CollegeSerializer
#     filter_backends = [DjangoFilterBackend, SearchFilter]
#     search_fields = ['name', 'location', 'university_name'] 
    
#     def perform_create(self, serializer):
#         college = serializer.save()  # Save the college instance
        
#         # Handle image uploads if they are included in the request data
#         if 'images' in self.request.FILES:
#             for image in self.request.FILES.getlist('images'):
#                 # Create CollegeImage instance using the file object
#                 CollegeImage.objects.create(college=college, image=image)
#         else:
#             raise ValidationError("No images uploaded")



class CollegeListView(APIView):
    def get(self, request):
        # Get the course_name from query parameters
        course_name = request.GET.get('course_name', '')
        print(f"Received course name: {course_name}")  

        # Filter colleges by course name if provided
        if course_name:
            colleges = College.objects.filter(courses__name__icontains=course_name)
        else:
            colleges = College.objects.all()

        # Serialize the colleges and return the response
        serializer = CollegeSerializer(colleges, many=True)
        return Response(serializer.data)





class CollegeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer

    def perform_update(self, serializer):
        college = serializer.save()  
        existing_images_data = self.request.data.get('existing_images', '[]')
        try:
            existing_image_ids = json.loads(existing_images_data)
            existing_image_ids = [int(id) for id in existing_image_ids]
         
            college.images.exclude(id__in=existing_image_ids).delete()
        except json.JSONDecodeError:
            raise ValidationError({'existing_images': 'Invalid format'})

        # Add new images from the 'images' field in request.FILES
        new_images = self.request.FILES.getlist('images')
        for image in new_images:
            CollegeImage.objects.create(college=college, image=image)
        
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        college = self.get_object()
        new_college_name = request.data.get('name', college.name)
        if College.objects.filter(name=new_college_name).exclude(id=college.id).exists():
            raise ValidationError({'name': 'A college with this name already exists.'})
        serializer = self.get_serializer(college, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    




class CollegeImageViewSet(viewsets.ModelViewSet):
    queryset = CollegeImage.objects.all()
    serializer_class = CollegeImageSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # partial=True to allow partial updates
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    

class CollegeCreateView(generics.CreateAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    
    def perform_create(self, serializer):
        college = serializer.save()
        images = self.request.FILES.getlist('images')
        for image in images:
            CollegeImage.objects.create(college=college, image=image)





class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    
    @action(detail=False, methods=['get'], url_path='by-ids')
    def get_colleges_by_ids(self, request):
        ids = request.query_params.get('ids', '').split(',')
        ids = [int(id) for id in ids if id.isdigit()]
        # print('Received IDs:', ids)
        colleges = College.objects.filter(id__in=ids)
        # print('Filtered Colleges:', colleges)
        serializer = CollegeSerializer(colleges, many=True)
        return Response(serializer.data)
    

    
    def list(self, request, *args, **kwargs):
        blog_id = request.query_params.get('blog_id', None)
        search_query = request.query_params.get('search_query', None)
        # print('Search Query:', search_query)

        if blog_id:
            try:
                blog = Blog.objects.get(id=blog_id)
                colleges = blog.colleges.all()
                serializer = CollegeSerializer(colleges, many=True)
                return Response(serializer.data)
            except Blog.DoesNotExist:
                return Response({"message": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
            

        if search_query:
            colleges = College.objects.filter(name__icontains=search_query)
            print('Found Colleges:', colleges)
            if colleges.exists():
                college_data = []
                for college in colleges:
                    images = college.images.all()
                    image_urls = [request.build_absolute_uri(img.image.url) for img in images]
                    college_data.append({
                        "id": college.id,
                        "name": college.name,
                        "location": college.location,
                        "slug": college.slug,
                        "images": image_urls if image_urls else [request.build_absolute_uri('/media/default-image.jpg')]
                    })
                
                return Response({"colleges": college_data})
        

            # 2. Search Courses
            courses = Course.objects.filter(name__icontains=search_query)
           

            if courses.exists():
                courses_data = []
                for course in courses:
                    college_courses = CollegeCourse.objects.filter(course=course)
                    

                    for college_course in college_courses:
                        try:
                            image_url = request.build_absolute_uri(course.image.url)
                        except Exception as e:
                            image_url = request.build_absolute_uri('/media/default-image.jpg')

                        courses_data.append({
                            "id": course.id,
                            "name": course.name,
                            "image": image_url,
                            "college_name": college_course.college.name
                        })
                
                return Response({"courses": courses_data})

            # 3. Search Universities
            universities = University.objects.filter(name__icontains=search_query)

            if universities.exists():
                return Response({
                    "universities": list(universities.values(
                        "id", "name", "description", "website", "established_year"
                    ))
                })
        else:
            colleges = College.objects.all()
            serializer = CollegeSerializer(colleges, many=True)
            return Response(serializer.data)

        return Response({"message": "No results found"})
   
    @action(detail=False, methods=['get'], url_path='slug/(?P<slug>[^/.]+)')
    def get_by_slug(self, request, slug=None):
        college = get_object_or_404(College, slug=slug)
        serializer = self.get_serializer(college)
        return Response(serializer.data)

    def perform_create(self, serializer):
        college_name = serializer.validated_data.get('name')
        if College.objects.filter(name=college_name).exists():
            raise ValidationError({'detail': 'College name already exists.'})
        serializer.save()

    @action(detail=False, methods=['post'], url_path='check_name')
    def check_name(self, request):
        college_name = request.data.get('name')
        if College.objects.filter(name=college_name).exists():
            return Response({"detail": "College name already exists."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "College name is available."}, status=status.HTTP_200_OK)




class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('name')
    serializer_class = CourseSerializer
    
    def perform_create(self, serializer):
        course = serializer.save()
        return course
    
    def get_queryset(self):
        college_id = self.request.query_params.get('college_id', None)
        course_name = self.request.query_params.get('name', None)
        if course_name:
            queryset = Course.objects.filter(name__iexact=course_name)
            return queryset
        if college_id:
            return Course.objects.filter(college__id=college_id)
        return Course.objects.all()
    
    def update(self, request, *args, **kwargs):
        course = self.get_object()
        serializer = self.get_serializer(course, data=request.data, partial=True)
        
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)
    


class AddCourseToCollegeView(APIView):
    def post(self,  request, *args, **kwargs):
        course_id = request.data.get('course')
        college_id = request.data.get('college')
        fees = request.data.get('fees')
        if not course_id or not college_id or fees is None:
            return Response({"detail": "Course ID, College ID, and Fees are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(id=course_id)
            college = College.objects.get(id=college_id)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        except College.DoesNotExist:
            return Response({"detail": "College not found."}, status=status.HTTP_404_NOT_FOUND)

        college_course, created = CollegeCourse.objects.get_or_create(
            course=course,
            college=college,
            defaults={"fees": fees}
        )
        serializer = CollegeCourseSerializer(college_course)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def put(self, request, *args, **kwargs):
            college_course_id = request.data.get('id')
            fees = request.data.get('fees')
            if not college_course_id or fees is None:
                return Response({"detail": "CollegeCourse ID and Fees are required."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                college_course = CollegeCourse.objects.get(id=college_course_id)
            except CollegeCourse.DoesNotExist:
                return Response({"detail": "CollegeCourse not found."}, status=status.HTTP_404_NOT_FOUND)

            college_course.fees = fees
            college_course.save()

            serializer = CollegeCourseSerializer(college_course)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, format=None):
        try:
            # with transaction.atomic():
            # print(f"Received DELETE request for course with id: {id}")
            college_course = CollegeCourse.objects.get(pk=pk)
               
            college_course.delete()
            return Response({"detail": "Course deleted successfully."}, status=status.HTTP_200_OK)

        except CollegeCourse.DoesNotExist:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
           
            print(f"Error deleting course with id {id}: {str(e)}")
            return Response({"detail": "An error occurred while deleting the course."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    def create(self, request, *args, **kwargs):
        # Handle incoming POST request and create new university
        return super().create(request, *args, **kwargs)
    




class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def create(self, request, *args, **kwargs):
        college_id = request.data.get('college_id')
        course_id = request.data.get('course_id')
        
        if not college_id and not course_id:
            return Response(
                {"error": "You must provide either 'college_id' or 'course_id' to create a section"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        college = None
        course = None

        if college_id:
            try:
                college = College.objects.get(id=college_id)
            except College.DoesNotExist:
                return Response({"error": "Invalid 'college_id' provided"}, status=status.HTTP_400_BAD_REQUEST)

        if course_id:
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response({"error": "Invalid 'course_id' provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Directly create the section using the actual objects
        section = Section.objects.create(
            name=request.data.get("name"),
            college=college,
            course=course
        )

        serializer = self.get_serializer(section)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        college_id = request.query_params.get('college_id')
        course_name = request.query_params.get('course_name')
        section_name = request.query_params.get('section_name')

        queryset = Section.objects.all()

        # Apply filtering logic
        if college_id:
            queryset = queryset.filter(college_id=college_id)
        if course_name:
            queryset = queryset.filter(course__name__icontains=course_name)
        if section_name:
            queryset = queryset.filter(name__icontains=section_name)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": f"Unable to delete: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
    @action(detail=False, methods=['get'])
    def best_courses(self, request):
        sections = Section.objects.filter(name__iexact='best courses')
        serializer = self.get_serializer(sections, many=True)
        return Response(serializer.data)
        




class PopularCoursesViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            popular_sections = Section.objects.filter(name="Popular Courses")
            courses = Course.objects.filter(section__in=popular_sections)
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



#filter

def unique_locations(request):
    locations = College.objects.values_list('location', flat=True).distinct()
    return JsonResponse({'locations': list(locations)})

def colleges_by_location(request, location):
    print(f"Location requested: {location}")
    colleges = College.objects.filter(location=location)  # Use filter instead of get_list_or_404
    if not colleges:
        return JsonResponse({'colleges': []})
    data = []
    for college in colleges:
        image_url = None
        college_images = CollegeImage.objects.filter(college=college)
        if college_images.exists():
            image_url = college_images.first().image.url
        data.append({
            'id': college.id,
            'name': college.name,
            'location': college.location,
            'image': image_url,  # Use the image_url from CollegeImage
        })
    
    return JsonResponse({'colleges': data})


def colleges_by_section(request, section_name):
    sections = Section.objects.filter(name__iexact=section_name)
    if not sections.exists():
        return JsonResponse({'error': 'No sections found'}, status=404)
    colleges = []
    for section in sections:
        college = section.college
        college_image = college.images.first()
        colleges.append({
            'id':college.id,
            'name': college.name,
            'location': college.location,
            'slug':college.slug,
            'image': college_image.image.url if college_image else None
        })
    return JsonResponse({'colleges': colleges})
 

def get_course_categories(request):
    categories = [{'key': key, 'value': value} for key, value in Course.CATEGORY_CHOICES]
    return JsonResponse(categories, safe=False)




def course_by_category(request):
    category = request.GET.get('category', None)
    if category:
         courses = Course.objects.filter(category=category)
    else:
        courses = Course.objects.all()
    data = [
        {
           "id": course.id,
            "name": course.name,
            "description": course.description,
            "semester": course.semester,
            "years": course.years,
            "colleges": [college_college.college.name for college_college in course.college_courses.all()],
            "category": course.category,
            "image": course.image.url if course.image else None, 
        }
        for course in courses
    ]
    return JsonResponse(data, safe=False)




class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def create(self, request, *args, **kwargs):
        print("Raw incoming data:", request.body) 
        print("Parsed request data:", request.data)
        try:
            response = super().create(request, *args, **kwargs)
            print("Blog created successfully:", response.data)
            return response
        except Exception as e:
            print("Error creating blog:", e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        blog = self.get_object()
        blog.delete() 
        return Response(status=status.HTTP_204_NO_CONTENT)
    



# views increment
@api_view(['POST'])
def increment_course_view(request, pk):
    try:
        course = Course.objects.get(pk=pk)
        course.views += 1
        course.save()
        return Response({"message": "View count updated", "views": course.views}, status=200)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)