from rest_framework import serializers
from .models import PhoneMap, Subscription, Review, Reservation

class PhoneMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneMap
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
