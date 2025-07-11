from django.urls import path, include
from . import views

urlpatterns = [
    path('step01/', views.basic_info_view, name='step01'),
    path('step02/', views.family_record_view, name='step02'),
    path('step03/', views.about_me_view, name='step03'),
    path('step04/', views.pet_view, name='step04'),
    path('step05/', views.funeral_view, name='step05'),
    path('step06/', views.medical_care_preparation_view, name='step06'),
    path('step07/', views.will_and_inheritance_view, name='step07'),
    path('step08/', views.bucket_list_view, name='step08'),
    path('step09/', views.guardian_selection_view, name='step09'),
    path('step10/', views.belongings_distribution_view, name='step10'),
    path('submit/', views.will_submit_view, name='submit'),
    path('temp/', views.will_temp_view, name='temp'),
    path('api/', include([
        path('reset/', views.reset_will_data_api, name='reset_will_data'),
        path('progress_step/', views.progress_step_api, name='progress_step'),
        path('complete/', views.complete_will_api, name='complete'),
    ])),
]