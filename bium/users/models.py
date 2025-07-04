from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class CustomUser(AbstractUser):
    name = models.CharField(max_length=30)  # 이름
    birth_date = models.DateField(null=True, blank=True)  # 생년월일
    phone_regex = RegexValidator(regex=r'^01[016789]-\d{3,4}-\d{4}$')
    phone_number = models.CharField(validators=[phone_regex], max_length=13, unique=True, null=True, blank=True)  # 휴대전화 번호

    def __str__(self):
        return self.username