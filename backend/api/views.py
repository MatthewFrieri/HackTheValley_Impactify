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
from twilio.rest import Client
import os

def formattedResponse(status, message, data = None, code = status.HTTP_200_OK):
    # Add the status, message and code
    res = { 'status': status, 'message': message }
    # If there is data, add it to the response
    if data is not None:
        res['data'] = data
    # Return the response
    return Response(res, status=code)

class LoginView(APIView):
    def post(self, request):
        try:
            # Get the username and password from the request
            username = request.data['username']
            password = request.data['password']
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
                return formattedResponse('Success', 'Login successful', { 'user_id': user.id, 'user_type': user_type })
            else:
                # Return a failure response
                return formattedResponse('Error', 'Invalid credentials', code=status.HTTP_401_UNAUTHORIZED)
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Invalid request', code=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        try:
            # Create a new user
            serializer = UserSerializer(data=request.data)
            # Validate the input data
            if serializer.is_valid():
                # Create the user if valid
                serializer.save()
                # Return a success response
                return formattedResponse('Success', 'User registered successfully', code=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                # Return validation errors
                return formattedResponse('Error', 'Invalid input', serializer.errors, code=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # If there is an invalid key
            return formattedResponse('Error', 'Invalid request', e.__repr__, code=status.HTTP_400_BAD_REQUEST)

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
            return formattedResponse('Success', 'Sessions retrieved successfully', [{
                'session_id': s.id, 
                'session_name': s.session_name,
                'time_start': s.time_start,
                'time_end': s.time_end
            } for s in session])
        except KeyError as e:
            # If there is an invalid key
            return formattedResponse('Error', 'Invalid request', e.__repr__, code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)

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
                # Send success response
                return formattedResponse('Success', 'Data saved successfully')
        except KeyError:
            print("Key error")
            # If there is an invalid key
            return formattedResponse('Error', 'Key error', code=status.HTTP_400_BAD_REQUEST)
        except UserSession.DoesNotExist:
            print("No active session found")
            # If there is no session started
            return formattedResponse('Error', 'No active session found', code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            print(request.data)
            # Get the user ID from the query params
            session_id = request.query_params['session_id']
            # Get the session data for this session
            session_data = SessionData.objects.filter(session_id=session_id)
            # Return the session data
            return formattedResponse('Success', 'Session data retrieved successfully', [
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
            return formattedResponse('Error', 'Session ID not in query params', code=status.HTTP_400_BAD_REQUEST)
        except UserSession.DoesNotExist:
            # If there is no session found
            return formattedResponse('Error', 'Session not found', code=status.HTTP_404_NOT_FOUND)

class SessionStartView(APIView):
    def post(self, request):
        try:
            print(request.data)
            # Get the user from the request
            user_id = request.data['user_id']
            session_name = request.data['session_name']
            # Get the user associated with the user ID
            user = User.objects.get(id=user_id)
            try:
                # Get the most recent session from the UserSession table
                s = UserSession.objects.filter(user_id=user.id).latest('id')
                # Check that the session has not ended
                if s.session_id.time_end is None:
                    # Debug message
                    print("Most recent session has not ended")
                    # Return an error response
                    return formattedResponse('Error', 'Most recent session has not ended', code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except UserSession.DoesNotExist:
                # This is the first session
                print("No active session found")
            # Create a new session
            session = Session.objects.create(user_id=user, session_name=session_name)
            # Insert the session into the UserSession table
            user_session = UserSession.objects.create(user_id=user, session_id=session)
            # Save the session
            session.save()
            user_session.save()
            # Return the session id
            return formattedResponse('Success', 'Session started successfully', { 'session_id': session.id })
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Key error, user_id or session_id invalid', code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)

class SessionStopView(APIView):
    def post(self, request):
        try:
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
            return formattedResponse('Success', 'Session ended successfully')
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Key error, user_id or session_id invalid', code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)

class UserViewAll(APIView):
    def get(self, request):
        try:
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
            # Exclude the players that are already associated with this coach
            try:
                players = CoachUser.objects.filter(coach_id=user_id)
                users = users.exclude(id__in=[p.user_id.id for p in players])
            except CoachUser.DoesNotExist:
                print("No players found for this coach")
            # Serialize the users
            serializer = UserSerializer(users, many=True)
            # Return the serialized users
            return formattedResponse('Success', 'Users retrieved successfully', serializer.data)
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Key error, user_id invalid', code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)

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
            return formattedResponse('Success', 'Players retrieved successfully', [{ 'user_id': p.user_id.id, 'username': p.user_id.username } for p in players])
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Key error, user_id invalid', code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)
        except CoachUser.DoesNotExist:
            # If there are no players associated with this coach
            return formattedResponse('Success', 'No players found for this coach', [])
    
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
            return formattedResponse('Success', 'Player added successfully')
        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Key error, user_id or player_id invalid', code=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            # If there is no user found
            return formattedResponse('Error', 'User not found', code=status.HTTP_404_NOT_FOUND)
        except CoachUser.DoesNotExist:
            # If there is no coach found
            return formattedResponse('Error', 'Coach not found', code=status.HTTP_404_NOT_FOUND)
        
class SendSmsView(APIView):
    def get(self, request):
        try:
            print(request.query_params)
            # Get the user ID from the query params
            user_id = request.query_params['user_id']
            # Get the user associated with the user ID
            user = User.objects.get(id=user_id)

            # --------- Send the SMS ---------

            # Your Twilio account SID and Auth Token (found in the Twilio dashboard)
            account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
            auth_token = os.environ.get("TWILIO_AUTH_TOKEN")

            # Initialize the Twilio client
            client = Client(account_sid, auth_token)

            def send_sms(to_number: str, from_number: str, message_body: str):
                message = client.messages.create(
                    body=message_body,
                    from_=from_number,
                    to=to_number
                )
            
            try:
                coach = CoachUser.objects.get(user_id=user_id)

                # Replace the values below with your Twilio number and the recipient's number
                to_number = '+14169482842'   # The phone number you're sending the SMS to
                from_number = '+17097973306' # Your Twilio phone number
                message_body = f"Hello {coach.coach_id.username}! Your player {user.username} is in critical condition. He needs to seek medical attention immediately."

                # Call the function to send the SMS
                send_sms(to_number, from_number, message_body)
            except CoachUser.DoesNotExist:
                print("No coach found for this player")

        except KeyError:
            # If there is an invalid key
            return formattedResponse('Error', 'Invalid request', code=status.HTTP_400_BAD_REQUEST)
