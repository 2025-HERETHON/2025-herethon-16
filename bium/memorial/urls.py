from django.urls import path
from .views import (public_memorial_list_view, memorial_detail_view,
                    my_memorial_space_view, memorial_edit_viewi, memorial_delete_view,
                    condolence_message_view, condolence_edit_view, condolence_delete_view,
                    generate_agent_link_view, agent_access_view
                    )

urlpatterns = [
    path('space/', public_memorial_list_view, name='public_memorial_list_view'),
    path('space/<int:memorial_id>/', memorial_detail_view, name='memorial_detail_view'),
    
    path('space_my/', my_memorial_space_view, name='my_memorial_space_view'),
    path('space_my/<int:memorial_id>/edit/', memorial_edit_view, name='memorial_edit_view'),
    path('space_my/<int:memorial_id>/delete/', memorial_delete_view, name='memorial_delete_view'),
    
    
    path('space/<int:memorial_id>/messages', condolence_message_view, name='condolence_message_view'),
    path('space/messages/<int:message_id>/edit/', condolence_edit_view, name='condolence_edit_view'),
    path('space/messages/<int:message_id>/delete/', condolence_delete_view, name='condolence_delete_view'),

    path('space_my/<int:memorial_id>/generate_agent_link', generate_agent_link_view, name='generate_agent_link_view'), # ✅ 대리인 링크 생성 API
    path('space/agent/<uuid:agent_token>/', agent_access_view, name='agent_access_view'),  # ✅ 대리인 접근 링크
    
]

