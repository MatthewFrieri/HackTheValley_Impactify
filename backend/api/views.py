from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import TestSerializer
from .models import Test

# Create your views here.

class LoginView(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
