# api/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import College, CollegeImage,Facility,Course,University
from .serializer import CollegeSerializer, CollegeImageSerializer, FacilitySerializer,CourseSerializer,UniversitySerializer
# from .pagination import CoursePagination
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.conf import settings
import logging

logger = logging.getLogger(__name__)











# Twilio credentials (replace these with your actual credentials)


client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
twilio_number = settings.TWILIO_PHONE_NUMBER
admin_phone = settings.ADMIN_PHONE



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
                from_=twilio_number,
                to=admin_phone
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




class CollegeList(generics.ListCreateAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    
    def perform_create(self, serializer):
        college = serializer.save()  # Save the college instance
        
        # Handle image uploads if they are included in the request data
        if 'images' in self.request.FILES:
            for image in self.request.FILES.getlist('images'):
                # Create CollegeImage instance using the file object
                CollegeImage.objects.create(college=college, image=image)
        else:
            raise ValidationError("No images uploaded")
            





class CollegeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer

    def perform_update(self, serializer):
        college = serializer.save()
        
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
        

        # facilities_data = self.request.data.getlist('facilities')
        # print(f"Facilities Data: {facilities_data}")
        # try:
        #     facilities_ids =facilities_data
        #     if isinstance(facilities_ids, list) and all(facility_id.isdigit() for facility_id in facilities_data):  # Ensure it's a list
        #         facilities_instances = Facility.objects.filter(id__in=facilities_ids)
        #         college.facilities.set(facilities_instances)
        #     else:
        #         raise ValidationError({'facilities': 'Invalid format, expected a list of IDs'})
        # except (json.JSONDecodeError, ValueError):
        #     raise ValidationError({'facilities': 'Invalid format'})



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



class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    def get_queryset(self):
        queryset = College.objects.all()  # Start by fetching all colleges
        category = self.request.query_params.get('category', None)  # Get the 'category' parameter from the request
        course_name = self.request.query_params.get('course', None)
        location = self.request.query_params.get('location', None)  # Get the 'location' parameter
        if location:
            # Filter by location if it is provided
            queryset = queryset.filter(location=location)
        if category:
            # If a category is specified, filter the colleges by the course category
            queryset = queryset.filter(courses__category=category)
        if course_name:
            queryset = queryset.filter(courses__name=course_name)
        return queryset

    def perform_update(self, serializer):
        # Custom update method for handling facilities
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
    
# class FacilityViewSet(viewsets.ModelViewSet):
#     queryset = Facility.objects.all()
#     serializer_class = FacilitySerializer
