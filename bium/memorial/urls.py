from django.urls import path
from .views import (public_memorial_list_api, memorial_list_detail_api,
                    my_memorial_space_api, update_delete_my_memorial_space_api, 
                    condolence_message_api, condolence_update_delete_api,
                    agent_access_view, generate_agent_link_api
                    )

urlpatterns = [
    path('space/', public_memorial_list_api, name='public_memorial_list_api'),
    path('space/<int:memorial_id>/', memorial_list_detail_api, name='memorial_list_detail_api'),
    path('space_my/', my_memorial_space_api, name='my_memorial_space_api'),
    path('space_my/<int:memorial_id>/', update_delete_my_memorial_space_api, name='update_delete_my_memorial_space_api'),
    path('space/<int:memorial_id>/messages/', condolence_message_api, name='condolence_message_api'),
    path('space/messages/<int:message_id>/', condolence_update_delete_api, name='condolence_update_delete_api'),

    path('space_my/<int:memorial_id>/generate_agent_link', generate_agent_link_api, name='generate_agent_link_api'), # ✅ 대리인 링크 생성 API
    path('space/agent/<uuid:agent_token>/', agent_access_view, name='agent_access_view'),  # ✅ 대리인 접근 링크
    
]

