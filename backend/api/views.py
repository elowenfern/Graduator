# api/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import College, CollegeImage,Facility,Course,University
from .serializer import CollegeSerializer, CollegeImageSerializer, FacilitySerializer,CourseSerializer,UniversitySerializer

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
        

        facilities_data = self.request.data.getlist('facilities')
        print(f"Facilities Data: {facilities_data}")
        try:
            facilities_ids =facilities_data
            if isinstance(facilities_ids, list) and all(facility_id.isdigit() for facility_id in facilities_data):  # Ensure it's a list
                facilities_instances = Facility.objects.filter(id__in=facilities_ids)
                college.facilities.set(facilities_instances)
            else:
                raise ValidationError({'facilities': 'Invalid format, expected a list of IDs'})
        except (json.JSONDecodeError, ValueError):
            raise ValidationError({'facilities': 'Invalid format'})



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




class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
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
    
class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
