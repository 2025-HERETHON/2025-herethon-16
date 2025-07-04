from django.urls import path
from .views import signup_api, login_api

urlpatterns = [
    path('signup/', signup_api, name='signup_api'),
    path('login/', login_api, name='login_api'),
]