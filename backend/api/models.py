from django.db import models

# Create your models here.

    

    




class University(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    established_year = models.IntegerField(blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name  

class College(models.Model):
    name=models.CharField(max_length=100)
    location=models.CharField(max_length=100)
    description=models.TextField(default="This is a college offering various courses and facilities.") 
    university = models.ForeignKey(University, related_name='colleges', on_delete=models.CASCADE, null=True, blank=True)
    map_location = models.URLField(max_length=200, blank=True, null=True) 
    contact_number = models.CharField(max_length=20, null=True, blank=True)
   
    def __str__(self):
        return self.name
    
class Facility(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=255, blank=True, null=True)
    college = models.ForeignKey(College, related_name='facilities', on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.name 
    
class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    college = models.ForeignKey(College, related_name='courses', on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    


    


class CollegeImage(models.Model):
    college=models.ForeignKey(College,related_name='images',on_delete=models.CASCADE)
    image=models.ImageField(upload_to='college_images/')

    def __str__(self):
        return f"Image for {self.college.name}"
