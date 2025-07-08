from django.db import models
from django.conf import settings
import uuid

# 사용자가 생성한 추모공간 정보를 저장하는 모델
# 이름, 설명, 생몰일, 프로필/배경 이미지, 공개 여부 등을 포함하며
# 로그인한 사용자(creator)와 연결됨
class MemorialSpace(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    birth_date = models.DateField(null=True, blank=True)
    death_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(
        upload_to='memorials/profile/', null=True, blank=True,
        default='memorials/profile/default_profile.png')
    background_image = models.ImageField(
        upload_to='memorials/background/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    agent_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    agent_assigned_at = models.DateTimeField(null=True, blank=True)


#헌화 이미지 7개중에 선택
FLOWER_CHOICES = [
    ('condolences/flower/default_flower.png', 'flower1'),
    ('condolences/flower/flower2.png', 'flower2'),
    ('condolences/flower/flower3.png', 'flower3'),
    ('condolences/flower/flower4.png', 'flower4'),
    ('condolences/flower/flower5.png', 'flower5'),
    ('condolences/flower/flower6.png', 'flower6'),
    ('condolences/flower/flower7.png', 'flower7'),
    
]

#추모공간 댓글
class CondolenceMessage(models.Model):
    memorial_space = models.ForeignKey('MemorialSpace', on_delete=models.CASCADE, related_name='messages')
    writer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    flower_image = models.CharField( 
        max_length=100,
        choices=FLOWER_CHOICES,
        default='condolences/flower/default_flower.png')  
    created_at = models.DateTimeField(auto_now_add=True)