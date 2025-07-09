from django.urls import path
from .views import signup_api, login_api, check_login_api

urlpatterns = [
    path('signup/', signup_api, name='signup_api'),
    path('login/', login_api, name='login_api'),
    path('check_login/', check_login_api, name='check_login_api'),
]