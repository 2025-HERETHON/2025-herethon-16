from django.urls import path
from .views import (checklist_view, checklist_save_view,
                    init_checklist_data #초기 데이터 생성용
                    )

urlpatterns = [
    path("check/", checklist_view, name="checklist_view"),
    path("save/", checklist_save_view, name="checklist_save_view"),
    path("init/", init_checklist_data), #초기 데이터 생성용 (사용X)
]
