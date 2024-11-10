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
        fields = ['id', 'name', 'icon']


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'fees', 'college']  # Add 'college'



class CollegeSerializer(serializers.ModelSerializer):
    images = CollegeImageSerializer(many=True, read_only=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), allow_null=True)  # Use PrimaryKeyRelatedField
    courses = CourseSerializer(many=True, read_only=True)
    # facilities = serializers.ListField(
    #     child=serializers.IntegerField(), write_only=True, required=False
    # )
    facilities = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), many=True)
    
    class Meta:
        model = College
        fields = ['id', 'name', 'location', 'description', 'university', 'map_location', 'contact_number', 'facilities', 'courses', 'images']

    def create(self, validated_data):
        facilities_data = validated_data.pop('facilities', None)
        images_data = validated_data.pop('images', [])
        college = College.objects.create(**validated_data)
        for image in images_data:
            CollegeImage.objects.create(college=college, image=image)
        for facility_id in facilities_data:
            facility = Facility.objects.get(id=facility_id)
            college.facilities.add(facility)
        return college
    
    
    

    def update(self, instance, validated_data):
        print("Validated data:", validated_data)
        # facilities = validated_data.pop('facilities', [])
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.university = validated_data.get('university', instance.university)  # Now this should correctly handle the university ID
        
        # Set the new facilities
        # if facilities:
        #     instance.facilities.set(facilities) 
        
        # Handle image updates if necessary (if you are using images in the form)
        images = validated_data.pop('images', [])
        if images:
            instance.images.set(images)  # Update images
        
        instance.save()
        return instance








class UniversitySerializer(serializers.ModelSerializer):
    

    class Meta:
        model = University
        fields = ['id', 'name', 'location', 'description', 'established_year', 'website']