from django.db import models
from django.conf import settings

# 사용자가 생성한 추모공간 정보를 저장하는 모델
# 이름, 설명, 생몰일, 프로필/배경 이미지, 공개 여부 등을 포함하며
# 로그인한 사용자(creator)와 연결됨
class MemorialSpace(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    birth_date = models.DateField(null=True, blank=True)
    death_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='memorials/profile/', null=True, blank=True)
    background_image = models.ImageField(upload_to='memorials/background/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

