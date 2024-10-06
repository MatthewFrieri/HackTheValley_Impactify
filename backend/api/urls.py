from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('session/', views.SessionView.as_view(), name='session'),
    path('session/data/', views.SessionDataView.as_view(), name='session_data'),
    path('session/all/', views.SessionAllView.as_view(), name='session_all'),
    path('session/start/', views.SessionStartView.as_view(), name='session_start'),
    path('session/end/', views.SessionStopView.as_view(), name='session_end'),
    path('coach/players/', views.CoachUserView.as_view(), name='coach'),
    path('players/all/', views.UserViewAll.as_view(), name='players'),
]