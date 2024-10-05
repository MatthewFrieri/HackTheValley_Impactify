from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import UserSerializer, SessionDataSerializer
from django.contrib.auth.models import User
from .models import *
import datetime

# Create your views here.

class LoginView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SessionDataView(APIView):
    def post(self, request):
        # Debug
        print(request.data)
        # Get the data from the request
        try:
            timestamp = request.data['timestamp']
            pressure_l = request.data['pressures']['left']
            pressure_r = request.data['pressures']['right']
            pressure_b = request.data['pressures']['back']
            pressure_t = request.data['pressures']['top']
            accel_x = request.data['acceleration']['x']
            accel_y = request.data['acceleration']['y']
            accel_z = request.data['acceleration']['z']
            # Get the most recent session ID from the UserSession table by primary key
            session_id = UserSession.objects.latest('id').session_id
            # Insert the data into the SessionData table
            SessionData.objects.create(
                session_id=session_id,
                timestamp=timestamp,
                pressure_l=pressure_l,
                pressure_r=pressure_r,
                pressure_b=pressure_b,
                pressure_t=pressure_t,
                accel_x=accel_x,
                accel_y=accel_y,
                accel_z=accel_z
            )
            # Save the data
            SessionData.save()
        except KeyError:
            # Return an error response
            return Response('Error', status=400)

        # Return a success response
        return Response('Success')

class SessionStartView(APIView):
    def post(self, request):
        # Get the user from the request
        user = User.objects.get(id=request.data['user_id'])
        # Create a new session
        session = Session.objects.create(user=user)
        # Insert the session into the UserSession table
        user_session = UserSession.objects.create(user_id=user.id, session_id=session.id)
        # Save the session
        session.save()
        user_session.save()
        # Return the session id
        return Response({'session_id': session.id})
    
class SessionStopView(APIView):
    def post(self, request):
        # Get the user from the request
        user = User.objects.get(id=request.data['user_id'])
        # Get the most recent session from the UserSession table
        session_id = UserSession.objects.filter(user_id=user.id).latest('id').session_id
        # Get the session from the Session table
        session = Session.objects.get(id=session_id)
        # Update the session end time
        session.time_end = datetime.now()
        # Save the session
        session.save()
        # Return a success response
        return Response('Success')