from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer, SessionDataSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import *
import datetime


# Create your views here.

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in, this will create a session
            login(request, user)

            # You can return session-related data if necessary
            session_key = request.session.session_key
            return Response({
                "message": "You are now logged in",
                "session_key": session_key,
                "user_id": user.id,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        # Validate the input data
        if serializer.is_valid():
            # Create the user if valid
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        else:
            # Return validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            session_data = SessionData.objects.create(
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
            session_data.save()
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except UserSession.DoesNotExist:
            # If there is no session started
            return Response('No active session found', status=500)
        # Return a success response
        return Response('Success')


class SessionStartView(APIView):
    def post(self, request):
        try:
            # Get the user from the request
            user_id = request.data['user_id']
            session_name = request.data['session_name']
            # Create a new session
            session = Session.objects.create(user_id=user_id, session_name=session_name)
            # Insert the session into the UserSession table
            user_session = UserSession.objects.create(user_id=user_id, session_id=session.id)
            # Save the session
            session.save()
            user_session.save()
            # Return the session id
            return Response({'session_id': session.id})
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)


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
