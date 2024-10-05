#models
from .models import SessionData
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True},  # Make password write-only
            'date_joined': {'read_only': True},  # Make date_joined read-only
            'last_login': {'read_only': True}  # Make last_login read-only
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)


class SessionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionData
        fields = '__all__'