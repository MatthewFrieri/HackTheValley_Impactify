from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('session/data/', views.SessionDataView.as_view(), name='session_data'),
    path('session/start/', views.SessionStartView.as_view(), name='session_start'),
    path('session/end/', views.SessionStopView.as_view(), name='session_end'),

]