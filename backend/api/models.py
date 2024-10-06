import uuid
from enum import Enum
from django.db import models
from django.contrib.auth.models import User

class UserType(Enum):
    COACH = 'coach'
    PLAYER = 'player'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=[(tag, tag.value) for tag in UserType], default=UserType.PLAYER)
    phone_number = models.CharField(max_length=15, blank=True)

class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_name = models.CharField(max_length=100, default='My Session')
    time_start = models.DateTimeField(auto_now_add=True)
    time_end = models.DateTimeField(null=True)
    
class SessionData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_id = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='session_data')
    timestamp = models.DateTimeField(auto_now_add=True)
    pressure_l = models.FloatField()
    pressure_r = models.FloatField()
    pressure_b = models.FloatField()
    pressure_t = models.FloatField()
    accel_x = models.FloatField()
    accel_y = models.FloatField()
    accel_z = models.FloatField()

class UserSession(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sessions')
    session_id = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='user_sessions')

class CoachUser(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player_user')
    coach_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coach_user')