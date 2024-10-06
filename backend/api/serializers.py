#models
from .models import Profile, SessionData
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    # Add the user_type field to the UserSerializer
    user_type = serializers.CharField(source='profile.user_type')
    # Add the phone_number field to the UserSerializer
    phone_number = serializers.CharField(source='profile.phone_number')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'user_type', 'phone_number', 'date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
            'last_login': {'read_only': True}
        }

    def create(self, validated_data):
        # Remove the nested user_type data
        user_type = validated_data.pop('profile', {}).get('user_type', 'player') 
        phone_number = validated_data.pop('profile', {}).get('phone_number', '')
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])  
        # Create the User object
        user = super(UserSerializer, self).create(validated_data)
        # Create the Profile object
        Profile.objects.create(user=user, user_type=user_type, phone_number=phone_number)
        return user


class SessionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionData
        fields = '__all__'