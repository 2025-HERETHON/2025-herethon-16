from django.urls import path
from .views import (checklist_get_api, checklist_save_api,
                    init_checklist_data #초기 데이터 생성용
                    )

urlpatterns = [
    path("check/", checklist_get_api, name="checklist_get_api"),
    path("save/", checklist_save_api, name="checklist_save_api"),
    path("init/", init_checklist_data), #초기 데이터 생성용 (API 사용X)
]
