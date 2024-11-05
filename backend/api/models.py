from django.db import models

# Create your models here.
class College(models.Model):
    name=models.CharField(max_length=100)
    location=models.CharField(max_length=100)
    description=models.CharField(max_length=500)

    def __str__(self):
        return self.name

class CollegeImage(models.Model):
    college=models.ForeignKey(College,related_name='images',on_delete=models.CASCADE)
    image=models.ImageField(upload_to='college_images/')

    def __str__(self):
        return f"Image for {self.college.name}"