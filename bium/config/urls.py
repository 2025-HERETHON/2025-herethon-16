from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('will/', include('will.urls')),
    path('api/memorial/',include('memorial.urls')),
    path('api/checklist/',include('checklist.urls')),
]