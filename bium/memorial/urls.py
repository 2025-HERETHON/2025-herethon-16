from django.urls import path
from .views import (public_memorial_list_api, 
                    my_memorial_space_api, update_delete_my_memorial_space_api, 
                    condolence_message_api, condolence_update_delete_api)

urlpatterns = [
    path('space/', public_memorial_list_api, name='public_memorial_list_api'),
    path('space_my/', my_memorial_space_api, name='my_memorial_space_api'),
    path('space_my/<int:memorial_id>/', update_delete_my_memorial_space_api, name='update_delete_my_memorial_space_api'),
    path('space/<int:memorial_id>/messages/', condolence_message_api, name='condolence_message_api'),
    path('space/messages/<int:message_id>/', condolence_update_delete_api, name='condolence_update_delete_api'),
]
