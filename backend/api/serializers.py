from rest_framework import serializers
from django.contrib.auth.models import User
#models 
from .models import SessionData
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password','date_joined', 'last_login']

class SessionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionData
        fields = '__all__'