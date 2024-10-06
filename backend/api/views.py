from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer, SessionDataSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import *
from datetime import datetime
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

class LoginView(APIView):
    def post(self, request):
        # Get the username and password from the request
        username = request.data.get('username')
        password = request.data.get('password')
        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)
            # Get the user_type from the Profile model
            try:
                user_type = user.profile.user_type
            # Default value if there is no profile (backcompat)
            except Profile.DoesNotExist:
                user_type = 'player'
            # Return a success response
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'user_type': user_type
            })
        else:
            # Print errors
            print(request)
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    def post(self, request):
        # Create a new user
        serializer = UserSerializer(data=request.data)
        # Validate the input data
        if serializer.is_valid():
            # Create the user if valid
            user = serializer.save()
            print(user)
            # Return a success response
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            # Return validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SessionView(APIView):
    def get(self, request):
        try:
            print(request.data)
            # Get the user ID from the query params
            user_id = request.query_params['user_id']
            # Get the most recent session for this user
            s = UserSession.objects.filter(user_id=user_id).latest('id')
            # Return the session ID
            return Response({
                'session_id': s.session_id.id, 
                'session_name': s.session_id.session_name,
                'time_start': s.session_id.time_start,
                'time_end': s.session_id.time_end
            })
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except UserSession.DoesNotExist:
            # If there is no session found
            return Response({'session_id': None})

class SessionAllView(APIView):
    def get(self, request):
        try:
            print(request.data)
            # Get the user ID from the query params
            user_id = request.query_params['user_id']
            # Get the user associated with the user ID
            user = User.objects.get(id=user_id)
            # Get a list of sessions for this user
            session = Session.objects.filter(user_id=user).order_by('-time_start')
            # Return a list of session IDs
            return Response([{
                'session_id': s.id, 
                'session_name': s.session_name,
                'time_start': s.time_start,
                'time_end': s.time_end
            } for s in session])
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except User.DoesNotExist:
            # If there is no user found
            return Response('Error', status=500)

class SessionDataView(APIView):
    def post(self, request):
        try:
            print(request.data)
            # Check that request.data is a list of dictionaries
            if not isinstance(request.data, list):
                # Debug
                print("Sent data is not a list")
                # Return an error response
                return Response('Error', status=500)
            # Iterate over the list of dictionaries
            for item in request.data:
                pressure_l = item['pressures']['left']
                pressure_r = item['pressures']['right']
                pressure_b = item['pressures']['back']
                pressure_t = item['pressures']['top']
                accel_x = item['acceleration']['x']
                accel_y = item['acceleration']['y']
                accel_z = item['acceleration']['z']
                # Get the most recent session ID from the UserSession table by primary key
                session_id = UserSession.objects.latest('id').session_id
                # Insert the data into the SessionData table
                session_data = SessionData.objects.create(
                    session_id=session_id,
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
            print("No active session found")
            # If there is no session started
            return Response('No active session found', status=500)
        # Return a success response
        return Response('Success')

    def get(self, request):
        try:
            print(request.data)
            # Get the user ID from the query params
            session_id = request.query_params['session_id']
            # Get the session data for this session
            session_data = SessionData.objects.filter(session_id=session_id)
            # Return the session data
            return Response([
            {
                'timestamp': d.timestamp,
                'pressure_l': d.pressure_l,
                'pressure_r': d.pressure_r,
                'pressure_b': d.pressure_b,
                'pressure_t': d.pressure_t,
                'accel_x': d.accel_x,
                'accel_y': d.accel_y,
                'accel_z': d.accel_z
            } for d in session_data])
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except UserSession.DoesNotExist:
            # If there is no session found
            return Response('No active session found', status=500)

class SessionStartView(APIView):
    def post(self, request):
        try:
            print(request.data)
            # Get the user from the request
            user_id = request.data['user_id']
            session_name = request.data['session_name']
            # Get the user associated with the user ID
            user = User.objects.get(id=user_id)
            # Get the most recent session from the UserSession table
            s = UserSession.objects.filter(user_id=user.id).latest('id')
            # Check that the session has not ended
            if s.session_id.time_end is None:
                # Debug message
                print("Most recent session has not ended")
                # Return an error response
                return Response('Most recent session has not ended', status=500)
            # Create a new session
            session = Session.objects.create(user_id=user, session_name=session_name)
            # Insert the session into the UserSession table
            user_session = UserSession.objects.create(user_id=user, session_id=session)
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
        print(request.data)
        # Get the user from the request
        user = User.objects.get(id=request.data['user_id'])
        # Get the most recent session from the UserSession table
        s = UserSession.objects.filter(user_id=user.id).latest('id')
        # Get the session from the Session table
        session = Session.objects.get(id=s.session_id.id)
        # Update the session end time
        session.time_end = datetime.now()
        # Save the session
        session.save()
        # Return a success response
        return Response('Success')

class UserViewAll(APIView):
    def get(self, request):
        # Get the user from the request
        user_id = request.query_params['user_id']
        # Get all users
        users = User.objects.all()
        # Exclude the superuser
        users = users.exclude(is_superuser=True)
        # Exclude the current user
        users = users.exclude(id=user_id)
        # Exlude the coaches
        users = users.exclude(profile__user_type='coach')
        # Serialize the users
        serializer = UserSerializer(users, many=True)
        # Return the serialized users
        return Response(serializer.data)

class CoachUserView(APIView):
    def get(self, request):
        try:
            # Get the user from the request
            user_id = request.query_params['user_id']
            # Get the user associated with the user ID
            coach = User.objects.get(id=user_id)
            # Get the players associated with this coach
            players = CoachUser.objects.filter(coach_id=coach)
            # Return a list of user IDs and usernames associated with this coach
            return Response([{'user_id': p.user_id.id, 'username': p.user_id.username} for p in players])
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except User.DoesNotExist:
            # If there is no user found
            return Response('Error', status=500)
        except CoachUser.DoesNotExist:
            # If there are no players associated with this coach
            return Response([])
    
    def post(self, request):
        try:
            print(request.data)
            # Get the user from the request
            user_id = request.data['user_id']
            player_id = request.data['player_id']
            # Get the coach associated with the user ID
            coach = User.objects.get(id=user_id)
            # Get the player associated with the player ID
            player = User.objects.get(id=player_id)
            # Create a new coach-player relationship
            coach_user = CoachUser.objects.create(coach_id=coach, user_id=player)
            # Save the relationship
            coach_user.save()
            # Return a success response
            return Response('Success')
        except KeyError:
            # If there is an invalid key
            return Response('Error', status=500)
        except User.DoesNotExist:
            # If there is no user found
            return Response('Error', status=500)
        except CoachUser.DoesNotExist:
            # If there is no coach found
            return Response('Error', status=500)
        except User.DoesNotExist:
            # If there is no user found
            return Response('Error', status=500)