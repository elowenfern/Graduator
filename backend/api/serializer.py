# api/serializers.py
from rest_framework import serializers
from .models import College, CollegeImage

class CollegeImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegeImage
        fields = ['id','college_id', 'image']
    
    


class CollegeSerializer(serializers.ModelSerializer):
    images = CollegeImageSerializer(many=True,  read_only=True)

    class Meta:
        model = College
        fields = ['id','name', 'location', 'description', 'images']

    def create(self, validated_data):
        images_data = validated_data.pop('images',[])  # Extract images data
        college = College.objects.create(**validated_data)  # Create College instance

        # Save each image as a CollegeImage instance
        for image_data in images_data:
            CollegeImage.objects.create(college=college, **image_data)
        return college
    

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        instance.name = validated_data.get('name', instance.name)
        instance.location = validated_data.get('location', instance.location)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        # Handle images: create new ones or update existing ones
        for image_data in images_data:
            if 'id' in image_data:
                # Update existing image
                image_instance = CollegeImage.objects.get(id=image_data['id'])
                image_instance.image = image_data['image']
                image_instance.save()
            else:
                # Create new image
                CollegeImage.objects.create(college=instance, **image_data)

        return instance