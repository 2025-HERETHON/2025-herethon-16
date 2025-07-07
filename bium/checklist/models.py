from django.db import models
from django.conf import settings

#체크리스트 항목들을 분류하는 카테고리
class ChecklistCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#실제로 유저가 체크할 수 있는 체크리스트 항목
class ChecklistItem(models.Model):
    category = models.ForeignKey(ChecklistCategory, on_delete=models.CASCADE, related_name='items')
    content = models.CharField(max_length=255)

    def __str__(self):
        return self.content

#유저가 어떤 항목을 체크했는지 여부를 저장
class UserChecklist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item = models.ForeignKey(ChecklistItem, on_delete=models.CASCADE)
    is_checked = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'item')
