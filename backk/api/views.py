# api/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import College, CollegeImage,Facility,Course,University,Section
from .serializer import CollegeSerializer, CollegeImageSerializer, FacilitySerializer,CourseSerializer,UniversitySerializer,SectionSerializer
# from .pagination import CoursePagination
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.viewsets import ViewSet
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
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

logger = logging.getLogger(__name__)
logger.info(f"Twilio SID: {settings.TWILIO_ACCOUNT_SID}")
logger.info(f"Twilio Token: {settings.TWILIO_AUTH_TOKEN}")
logger.info(f"Twilio Phone Number: {settings.TWILIO_PHONE_NUMBER}")
logger.info(f"Admin Phone: {settings.ADMIN_PHONE}")




TWILIO_ACCOUNT_SID='ACed6bbcdbf60bff5ebbbfb8fd92ea1417e'
TWILIO_AUTH_TOKEN='76d545f3fa1e45698b9a9fc90b8a9d03'
TWILIO_PHONE_NUMBER='whatsapp:+14155238886'
ADMIN_PHONE='whatsapp:+917356439929'



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


env = environ.Env()
environ.Env.read_env(env_file='.env') 
client = Client(env('TWILIO_ACCOUNT_SID'), env('TWILIO_AUTH_TOKEN'))

@csrf_exempt
def send_whatsapp(request):
    if request.method == "POST":
        try:
            # Get data from the request body
            data = json.loads(request.body.decode('utf-8'))
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            message=data.get('message')
            course = data.get('course')
            college = data.get('college')

            # Construct the message
            message_body = f"""
            New inquiry received:
            Name: {name}
            Email: {email}
            Phone: {phone}
            Message={message}
            Interested Course: {course}
            College: {college}
            """

            # Send the WhatsApp message to the admin
            message = client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=settings.ADMIN_PHONE
            )

            return JsonResponse({"message": "Message sent successfully!", "sid": message.sid}, status=200)
        except TwilioRestException as e:
            # Log Twilio-specific errors
            logger.error(f"Twilio API error: {str(e)}")
            return JsonResponse({"error": f"Twilio error: {str(e)}"}, status=500)
        except Exception as e:
            # Log unexpected errors
            logger.error(f"Unexpected error: {str(e)}")
            return JsonResponse({"error": f"Unexpected error: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)





class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            # Attempt to get the user by email
            user = User.objects.get(email=email)
            # Authenticate using the username and password
            user = authenticate(username=user.username, password=password)

            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'access': token.key, 'message': 'Login successful'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)




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
        college = serializer.save()  # Save the college instance

        # Print request data and files for debugging
        print(f"Request Data: {self.request.data}")
        print(f"FILES: {self.request.FILES}")

        # Retain only images specified by 'existing_images' in the request
        existing_images_data = self.request.data.get('existing_images', '[]')
        try:
            existing_image_ids = json.loads(existing_images_data)
            existing_image_ids = [int(id) for id in existing_image_ids]
            # Delete images not listed in existing_image_ids
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
        print(f"Request Data: {self.request.data}")
        print(f"FILES: {self.request.FILES}")
        college = serializer.save()
        images = self.request.FILES.getlist('images')
        for image in images:
            CollegeImage.objects.create(college=college, image=image)



logger = logging.getLogger(__name__)


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Retrieve the general search query
        search_query = self.request.query_params.get('college_name', None)

        if search_query:
            # Create a filter to check multiple fields
            filters = (
                Q(name__icontains=search_query) |
                Q(courses__name__icontains=search_query) |
                Q(location__icontains=search_query) |
                Q(university__name__icontains=search_query) |
                Q(courses__category__icontains=search_query)
            )
            print(f"Applying filters: {filters}")
            queryset = queryset.filter(filters).distinct()

        print(f"Final queryset: {queryset}")
        return queryset


    def perform_update(self, serializer):
        serializer.save()


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('name') 
    serializer_class = CourseSerializer
    

    def perform_create(self, serializer):
        college_id = self.request.data.get('college')
        if college_id:
            try:
                # Get the College object
                college = College.objects.get(id=college_id)
                # Save the course with the actual College instance
                serializer.save(college=college)
            except College.DoesNotExist:
                raise ValidationError({"college": "College with the given ID does not exist."})
        else:
            raise ValidationError({"college": "College ID is required."})
    def get_queryset(self):
        college_id = self.request.query_params.get('college_id', None)
        if college_id:
            print(f"Filtering courses for college_id: {college_id}") 
            return Course.objects.filter(college__id=college_id)
        return Course.objects.all()
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        college = self.get_object()
        serializer = self.get_serializer(college, data=request.data, partial=partial)
        
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)

    

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
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
             print("Validation errors:", serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        section = self.get_object()
        # Serialize the related colleges and return them in the response
        colleges = section.colleges.all()
        serializer = self.get_serializer(section)
        section_data = serializer.data
        section_data['colleges'] = CollegeSerializer(colleges, many=True).data
        return Response(section_data)
    
    def perform_destroy(self, instance):
        instance.delete()





#filter

def unique_locations(request):
    # Fetch unique locations from the College model
    locations = College.objects.values_list('location', flat=True).distinct()
    return JsonResponse({'locations': list(locations)})

def colleges_by_location(request, location):
    print(f"Location requested: {location}")
    colleges = College.objects.filter(location=location)  # Use filter instead of get_list_or_404
    if not colleges:
        return JsonResponse({'colleges': []})
    
    data = []

    for college in colleges:
        # Check if the college has related images
        image_url = None
        college_images = CollegeImage.objects.filter(college=college)
        if college_images.exists():
            # Get the first image related to the college (or modify as needed)
            image_url = college_images.first().image.url

        data.append({
            'id': college.id,
            'name': college.name,
            'location': college.location,
            'image': image_url,  # Use the image_url from CollegeImage
        })
    
    return JsonResponse({'colleges': data})

def colleges_by_section(request, section_name):
    # Fetch all sections matching the name
    sections = Section.objects.filter(name__iexact=section_name)
    
    # If no sections are found
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
            'image': college_image.image.url if college_image else None
        })
    
    return JsonResponse({'colleges': colleges})
 

def get_course_categories(request):
    categories = [{'key': key, 'value': value} for key, value in Course.CATEGORY_CHOICES]
    return JsonResponse(categories, safe=False)




def colleges_by_category(request):
    category = request.GET.get('category', None)
    if category:
        colleges = College.objects.filter(courses__category=category).distinct()
    else:
        colleges = College.objects.all()

    # Build the response data
    data = [
        {
            "id": college.id,
            "name": college.name,
            "location": college.location,
            "image": college.images.first().image.url if college.images.exists() else None  # Use first image or None
        }
        for college in colleges
    ]

    return JsonResponse(data, safe=False)
