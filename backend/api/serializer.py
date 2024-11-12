# api/serializers.py
from rest_framework import serializers
from .models import College, CollegeImage,Facility,Course,University
import json
from rest_framework.exceptions import ValidationError



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
        fields = ['id', 'name', 'description', 'fees', 'semester','years','college','category']  # Add 'college'



class CollegeSerializer(serializers.ModelSerializer):
    images = CollegeImageSerializer(many=True, read_only=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), allow_null=True)  # Use PrimaryKeyRelatedField
    courses = CourseSerializer(many=True, read_only=True)
    # facilities = FacilitySerializer(many=True, read_only=True)
    
    class Meta:
        model = College
        fields = ['id', 'name', 'location', 'description', 'university', 'map_location', 'contact_number', 'courses', 'images']

    def create(self, validated_data):
        facilities_data = validated_data.pop('facilities', None)
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








class UniversitySerializer(serializers.ModelSerializer):
    

    class Meta:
        model = University
        fields = ['id', 'name', 'location', 'description', 'established_year', 'website']