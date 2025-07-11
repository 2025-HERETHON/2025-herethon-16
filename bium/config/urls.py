from django.contrib import admin
from django.urls import path, include
from users.views import main_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main_view, name='main'),
    path('users/', include('users.urls')),
    path('will/', include('will.urls')),
    path('memorial/',include('memorial.urls')),

    path('api/checklist/',include('checklist.urls')),
]