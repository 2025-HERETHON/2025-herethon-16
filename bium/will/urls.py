from django.urls import path
from . import views

urlpatterns = [
    path('basic_info/', views.basic_info_api, name='basic_info'),
    path('family_record/', views.family_record_api, name='family_record'),
    path('about_me/', views.about_me_api, name='about_me'),
    path('pet/', views.pet_api, name='pet'),
    path('funeral/', views.funeral_api, name='funeral'),
    path('medical_care_preparation/', views.medical_care_preparation_api, name='medical_care_preparation'),
    path('will_and_inheritance/', views.will_and_inheritance_api, name='will_and_inheritance'),
    path('bucket_list/', views.bucket_list_api, name='bucket_list'),
    path('guardian_selection/', views.guardian_selection_api, name='guardian_selection'),
    path('belongings_distribution/', views.belongings_distribution_api, name='belongings_distribution'),
    path('reset/', views.reset_will_data_api, name='reset_will_data'),
    path('progress_step/', views.progress_step_api, name='progress_step'),
    # path('download_pdf/', views.download_will_pdf, name='download_will_pdf'),
]