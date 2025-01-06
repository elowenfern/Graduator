from django.db import models
from django.utils.text import slugify



    


class University(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    established_year = models.IntegerField(blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='university_images/', null=True, blank=True)
    def __str__(self):
        return self.name  

class College(models.Model):
    name=models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True,null=True)
    location=models.CharField(max_length=100)
    description=models.TextField(default="This is a college offering various courses and facilities.") 
    university = models.ForeignKey(University, related_name='colleges', on_delete=models.CASCADE, null=True, blank=True)
    google_map_url = models.URLField(max_length=200, blank=True, null=True) 
    contact_number = models.CharField(max_length=20, null=True, blank=True)
    year=models.PositiveIntegerField(null=True, blank=True)
    ownership = models.CharField(max_length=100, null=True, blank=True)  
    approval = models.CharField(max_length=100, null=True, blank=True)  
    logo = models.ImageField(upload_to='college_logos/', null=True, blank=True)
    youtube_link = models.URLField(max_length=200, blank=True, null=True)


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        original_slug = self.slug
        counter = 1
        while College.objects.filter(slug=self.slug).exists():
            self.slug = f"{original_slug}-{counter}"
            counter += 1
        super().save(*args, **kwargs)
    def __str__(self):
        return self.name
    

    
class Facility(models.Model):
    name = models.CharField(max_length=255, default="Unnamed Facility")
    icon = models.CharField(max_length=255, blank=True, null=True)
    def __str__(self):
        return self.name 
    


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('science', 'Science'),
        ('arts', 'Arts'),
        ('commerce', 'Commerce'),
        ('engineering', 'Engineering'),
        ('management','Management'),
        ('medical','Medical'),
        ('pharmacy','Pharmacy'),
        ('law','Law'),
        ('agriculture','Agriculture'),
        ('paramedical','Paramedical'),
        ('design','Design'),
        ('allied health science','Allied Health Science'),
        ('veterinary','Veterinary'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField()
    semester = models.IntegerField(default=0)  
    years = models.IntegerField(default=0) 
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='science')  
    image = models.ImageField(upload_to='course_images/', null=True, blank=True)
    views = models.PositiveIntegerField(default=0) 
    def __str__(self):
        return self.name
    class Meta:
        ordering = ['name'] 
    
class CollegeCourse(models.Model):
    course = models.ForeignKey(Course, related_name='college_courses', on_delete=models.CASCADE)
    college = models.ForeignKey(College, related_name='college_courses', on_delete=models.CASCADE)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.course.name} at {self.college.name}"
    class Meta:
        unique_together = ('course', 'college')  

    
class Section(models.Model):
    name = models.CharField(max_length=100)
    college = models.ForeignKey(College, on_delete=models.CASCADE,null=True,blank=True) 
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.name
    
class CollegeImage(models.Model):
    college=models.ForeignKey(College,related_name='images',on_delete=models.CASCADE)
    image=models.ImageField(upload_to='college_images/')

    def __str__(self):
        return f"Image for {self.college.name}"
    
class Blog(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    colleges = models.ManyToManyField('College', related_name='blogs')

    def __str__(self):
        return self.title



class Inquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField(null=True, blank=True)
    course = models.CharField(max_length=255)
    college = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Inquiry from {self.name}"
