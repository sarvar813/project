from django.db import models

class PhoneMap(models.Model):
    phone = models.CharField(max_length=20, unique=True)
    chat_id = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.phone} -> {self.chat_id}"

class Subscription(models.Model):
    phone = models.CharField(max_length=20)
    plan_name = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    price = models.CharField(max_length=50)
    gift = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone} - {self.plan_name} ({self.status})"

class Review(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    rating = models.IntegerField()
    comment = models.TextField()
    image = models.TextField(null=True, blank=True) # Base64 or URL
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Reservation(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    guests = models.IntegerField()
    date = models.CharField(max_length=20)
    time = models.CharField(max_length=20)
    comment = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
