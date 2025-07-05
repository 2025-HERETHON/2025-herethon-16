from django.urls import path
from .views import public_memorial_list_api, my_memorial_space_api

urlpatterns = [
    path('space/', public_memorial_list_api, name='public_memorial_list_api'),
    path('space_my/', my_memorial_space_api, name='my_memorial_space_api'),

]
