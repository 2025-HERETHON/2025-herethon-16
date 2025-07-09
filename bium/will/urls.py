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
    path('complete/', views.complete_will_api, name='complete'),
    path('step01/', views.step01_view, name='step01_page'),
    path('step02/', views.step02_view, name='step02_page'),
    path('step03/', views.step03_view, name='step03_page'),
    path('step04/', views.step04_view, name='step04_page'),
    path('step05/', views.step05_view, name='step05_page'),
    path('step06/', views.step06_view, name='step06_page'),
    path('step07/', views.step07_view, name='step07_page'),
    path('step08/', views.step08_view, name='step08_page'),
    path('step09/', views.step09_view, name='step09_page'),
    path('step10/', views.step10_view, name='step10_page'),
    path('submit/', views.will_submit_view, name='submit_page'),
]