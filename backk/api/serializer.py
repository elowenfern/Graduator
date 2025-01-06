# api/serializers.py
from rest_framework import serializers
from .models import College, CollegeImage,Facility,Course,University,Section,CollegeCourse,Blog,Inquiry
import json
from rest_framework.exceptions import ValidationError
from django.conf import settings
from django.utils.text import slugify




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
    

class CollegeCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer() 
    class Meta:
        model = CollegeCourse
        fields = ['id','course', 'fees'] 


class CollegeSerializer(serializers.ModelSerializer):
    images = CollegeImageSerializer(many=True, read_only=True)
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all(), allow_null=True)
    courses = serializers.SerializerMethodField()
    college_courses = CollegeCourseSerializer(many=True, read_only=True)
    class Meta:
        model = College
        fields = '__all__'
    def get_courses(self, obj):
       
        college_courses = CollegeCourse.objects.filter(college=obj)
        return CourseSerializer([cc.course for cc in college_courses], many=True).data

    def validate_description(self, value):
        return value

    def validate_slug(self, value):
        if not value:
            value = slugify(self.initial_data['name'])  # Generate slug if not provided
        return value

    def get_image(self, obj):
        # Ensure MEDIA_URL is only added once
        image_url = obj.image.url if obj.image else None
        if image_url and not image_url.startswith(settings.MEDIA_URL):
            return f"{settings.MEDIA_URL}{image_url}"
        return image_url
    
    def create(self, validated_data):
       
        images_data = validated_data.pop('images', [])
        college = College.objects.create(**validated_data)
       
        for image in images_data:
            CollegeImage.objects.create(college=college, image=image)
        
        return college
    
    def update(self, instance, validated_data):

        # Extract and update basic fields
        # facilities_data = validated_data.pop('facilities', [])
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.slug=validated_data.get('slug',instance.slug)
        instance.description = validated_data.get('description', instance.description)
        instance.university = validated_data.get('university', instance.university)
        instance.google_map_url = validated_data.get('google_map_url', instance.google_map_url)
        instance.year = validated_data.get('year', instance.year)
        instance.ownership = validated_data.get('ownership', instance.ownership)
        instance.approval = validated_data.get('approval', instance.approval)
        instance.logo = validated_data.get('logo', instance.logo)
        instance.youtube_link = validated_data.get('youtube_link', instance.youtube_link)
        # Save instance with updated basic fields
        instance.save()
        images = validated_data.pop('images', [])
        if images:
            instance.images.set(images)  # Update images

        return instance
    








class SectionSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True, default=None) 
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Section
        fields = ['id', 'name', 'college', 'college_name', 'course', 'course_name']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.course:
            representation['course_name'] = instance.course.name
        if self.context['request'].method == 'POST':
            representation.pop('course', None)
        return representation
    
    

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields =  '__all__'



    # colleges = serializers.ListField(
    #     child=serializers.PrimaryKeyRelatedField(queryset=College.objects.all())
    # )

class BlogSerializer(serializers.ModelSerializer):
    colleges = serializers.PrimaryKeyRelatedField(
        queryset=College.objects.all(), 
        many=True
    )
    class Meta:
        model = Blog
        fields = '__all__'
    
    def create(self, validated_data):
        colleges = validated_data.pop('colleges', [])
        blog = Blog.objects.create(**validated_data)
        blog.colleges.set(colleges) 
        return blog




 


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'