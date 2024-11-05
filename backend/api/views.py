# api/views.py
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import College, CollegeImage
from .serializer import CollegeSerializer, CollegeImageSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework import viewsets

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
                CollegeImage.objects.create(college=college, image=image)


class CollegeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
   

    def perform_update(self, serializer):
        college = serializer.save()
        
        # Handle image uploads if they are included in the request data
        if 'images' in self.request.FILES:
            new_images = self.request.FILES.getlist('images')  # Get new images from request
            college.images.all().delete()
            
            for image in new_images:
                CollegeImage.objects.create(college=college, image=image)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # Ensure partial updatet
        college = self.get_object()
        serializer = self.get_serializer(college, data=request.data,partial=partial)
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
