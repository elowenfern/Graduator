# api/serializers.py
from rest_framework import serializers
from .models import College, CollegeImage,Facility,Course,University,Section
import json
from rest_framework.exceptions import ValidationError
from django.conf import settings


class CollegeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeImage
        fields = ['id','image']
    
    

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id','name','icon']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields =  '__all__'



class CollegeSerializer(serializers.ModelSerializer):
    images = CollegeImageSerializer(many=True, read_only=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), allow_null=True)
    courses = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = College
        fields = '__all__'

    def get_image(self, obj):
        # Ensure MEDIA_URL is only added once
        image_url = obj.image.url if obj.image else None
        if image_url and not image_url.startswith(settings.MEDIA_URL):
            return f"{settings.MEDIA_URL}{image_url}"
        return image_url
    
    def create(self, validated_data):
        # facilities_data = validated_data.pop('facilities', None)
        images_data = validated_data.pop('images', [])
        college = College.objects.create(**validated_data)
        # college.facilities.set(facilities_data)
        for image in images_data:
            CollegeImage.objects.create(college=college, image=image)
        
        return college
    
    def update(self, instance, validated_data):
        print("Validated data:", validated_data)

        # Extract and update basic fields
        # facilities_data = validated_data.pop('facilities', [])
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.university = validated_data.get('university', instance.university)
        instance.google_map_url = validated_data.get('google_map_url', instance.google_map_url)

        # Save instance with updated basic fields
        instance.save()

        # Clear old facilities and set new ones
        # instance.facilities.clear()
        # for facility_data in facilities_data:
        #     # Assuming 'facility_data' is a dictionary with 'id' key
        #     facility = Facility.objects.get(id=facility_data['id'])
        #     instance.facilities.add(facility)

        # If you are updating images
        images = validated_data.pop('images', [])
        if images:
            instance.images.set(images)  # Update images

        return instance
    


class SectionSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'name', 'college','college_name']  # Display 'college' as an object, not a list






class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields =  '__all__'