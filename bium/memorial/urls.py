from django.urls import path, include
from . import views

urlpatterns = [
    # ✅ [SSR] 추모공간 뷰
    path("space/", views.public_memorial_list_view, name="public_memorial_list_view"),
    path("space/<int:memorial_id>/", views.memorial_detail_view, name="memorial_detail_view"),
    path("space/search/", views.memorial_search_view, name="memorial_search"),

    path("space_my/", views.my_memorial_space_view, name="my_memorial_space_view"),
    path("space_my/new/", views.my_memorial_space_create_view, name="my_memorial_space_create_view"),
    path("space_my/<int:memorial_id>/edit/", views.memorial_edit_view, name="memorial_edit_view"),
    path("space_my/<int:memorial_id>/delete/", views.memorial_delete_view, name="memorial_delete_view"),

    path("space/<int:memorial_id>/messages", views.condolence_message_view, name="condolence_message_view"),
    path("space/messages/<int:message_id>/edit/", views.condolence_edit_view, name="condolence_edit_view"),
    path("space/messages/<int:message_id>/delete/", views.condolence_delete_view, name="condolence_delete_view"),

    path("space_my/<int:memorial_id>/generate_agent_link", views.generate_agent_link_view, name="generate_agent_link_view"),
    path("space/agent/<uuid:agent_token>/", views.agent_access_view, name="agent_access_view"),

    # # ✅ [API] 추모공간 API 묶음
    # path("api/", include([
    #     path("space/", views.public_memorial_list_api, name="public_memorial_list_api"),
    #     path("space/<int:memorial_id>/", views.memorial_list_detail_api, name="memorial_list_detail_api"),

    #     path("space_my/", views.my_memorial_space_api, name="my_memorial_space_api"),
    #     path("space_my/<int:memorial_id>/", views.update_delete_my_memorial_space_api, name="update_delete_my_memorial_space_api"),

    #     path("space/<int:memorial_id>/messages/", views.condolence_message_api, name="condolence_message_api"),
    #     path("space/messages/<int:message_id>/", views.condolence_update_delete_api, name="condolence_update_delete_api"),

    #     path("space_my/<int:memorial_id>/generate_agent_link/", views.generate_agent_link_api, name="generate_agent_link_api"),
    #     path("space/agent/<uuid:agent_token>/", views.agent_access_view_api, name="agent_access_view_api"),
    #])),
]
