from django.db import models
from django.conf import settings

class Will(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    progress_step = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)

# 01. 나의 기본 정보
class BasicInfo(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    name = models.CharField(max_length=30)  # 이름
    birth_date = models.DateField(null=True, blank=True)  # 생년월일

    GENDER_CHOICES = [
        (1, '여성'),
        (2, '남성'),
    ]
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES)  # 성별

    phone_number = models.CharField(max_length=13, unique=True, null=True, blank=True)  # 휴대전화 번호
    birth_place = models.CharField(max_length=100)  # 태어난 곳
    registered_domicile = models.CharField(max_length=100)  # 본적
    current_diseases = models.TextField(blank=True, null=True)  # 앓고 있는 병
    past_diseases = models.TextField(blank=True, null=True)  # 과거 앓았던 병
    constitution = models.CharField(max_length=100)  # 체질
    family_tree = models.TextField(blank=True, null=True)  # 가계도

# 02. 가족에 대한 기록
class FamilyRecord(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    mother_record = models.TextField(blank=True, null=True)  # 어머니에 대한 기록
    father_record = models.TextField(blank=True, null=True)  # 아버지에 대한 기록
    siblings_record = models.TextField(blank=True, null=True)  # 형제자매에 대한 기록

# 03. 나에 대하여
class AboutMe(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    name_meaning = models.TextField(blank=True, null=True)  # 이름의 뜻
    nickname = models.TextField(blank=True, null=True)  # 별명
    favorites = models.TextField(blank=True, null=True)  # 좋아한 것들
    preferences = models.TextField(blank=True, null=True)  # 취향
    school_days = models.TextField(blank=True, null=True)  # 학창 시절
    work_and_social_life = models.TextField(blank=True, null=True)  # 직장과 사회생활
    writings = models.TextField(blank=True, null=True)  # 내가 쓴 글, 시, 편지 모음

# 04. 반려동물
class Pet(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    name = models.CharField(max_length=30)  # 이름
    species = models.CharField(max_length=100)  # 종별
    birth_date = models.DateField(null=True, blank=True)  # 생년월일

    GENDER_CHOICES = [
        (1, '여성'),
        (2, '남성'),
    ]
    gender = models.PositiveSmallIntegerField(choices=GENDER_CHOICES)  # 성별

    care = models.TextField(blank=True, null=True)  # 피임, 거세수술, 예방접종
    feeding = models.TextField(blank=True, null=True)  # 먹이
    hospital = models.TextField(blank=True, null=True)  # 담당 병원
    care_notes = models.TextField(blank=True, null=True)  # 사육 시 주의사항
    funeral_wishes = models.TextField(blank=True, null=True)  # 사망 시 희망 장례 방법
    caretaker = models.CharField(max_length=30, blank=True, null=True)  # 돌봄 책임자 지정
    care_cost_plan = models.TextField(blank=True, null=True)  # 돌봄 비용 마련
    substitute_plan = models.TextField(blank=True, null=True)  # 대체 계획과 감시자 지정

# 05. 장례 관련
class Funeral(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    FUNERAL_TYPE_CHOICES = [
        (1, '일반 장례식'),
        (2, '가족장'),
        (3, '무빈소 장례식'),
        (4, '종교장'),
        (5, '기타'),
    ]
    funeral_type = models.PositiveSmallIntegerField(choices=FUNERAL_TYPE_CHOICES)  # 장례 방식

    invited_guests = models.TextField(blank=True, null=True)  # 초대하고 싶은 손님
    funeral_wishes = models.TextField(blank=True, null=True)  # 장례식에 대한 희망사항

    GRAVE_TYPE_CHOICES = [
        (1, '매장묘'),
        (2, '봉안묘'),
        (3, '납골당'),
        (4, '수목장'),
        (5, '잔디장'),
        (6, '기타'),
    ]
    grave_type = models.PositiveSmallIntegerField(choices=GRAVE_TYPE_CHOICES)  # 산소 유형

    grave_preparation = models.TextField(blank=True, null=True)  # 장지에 대한 준비
    tombstone_inscription = models.TextField(blank=True, null=True)  # 묘비 문구
    memorial_service_wishes = models.TextField(blank=True, null=True)  # 제사에 대한 희망사항

# 06. 의료와 간병에 대한 준비
class MedicalCarePreparation(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    terminal_illness = models.BooleanField(default=False)  # 시한부
    hospice_care = models.TextField(blank=True, null=True)  # 종말 의료 신청 여부

    LIFE_SUPPORT_CHOICES = [
        (1, '연명치료를 원해요.'),
        (2, '연명치료를 원치 않아요.'),
    ]
    life_sustaining_treatment = models.PositiveSmallIntegerField(choices=LIFE_SUPPORT_CHOICES)  # 연명치료

    organ_and_tissue_donation = models.TextField(blank=True, null=True)  # 장기 및 인체조직 기증

# 07. 유언과 상속
class WillAndInheritance(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    message_to_parents = models.TextField(blank=True, null=True)  # 부모님에게 남기고 싶은 말
    message_to_friends = models.TextField(blank=True, null=True)  # 친구에게 남기고 싶은 말
    will_text = models.TextField(blank=True, null=True)  # 유언장 문구
    assets_and_distribution = models.TextField(blank=True, null=True)  # 재산 목록과 배분
    credit_card_list = models.TextField(blank=True, null=True)  # 신용카드 목록
    pension_and_insurance = models.TextField(blank=True, null=True)  # 연금 및 보험 가입 내역 및 계약서
    debts = models.TextField(blank=True, null=True)  # 채무의 존재
    will_storage_location = models.TextField(blank=True, null=True)  # 유언장을 보관할 장소

# 08. 향후 해 보고 싶은 것들
class BucketList(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    bucket_list = models.TextField(blank=True, null=True)  # 해 보고 싶은 목록

# 09. 후견인 선택
class GuardianSelection(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    guardian_name = models.CharField(max_length=30, blank=True, null=True)  # 후견인 이름
    guardian_contact = models.TextField(blank=True, null=True)  # 후견인 연락처
    emergency_contact = models.TextField(blank=True, null=True)  # 비상 연락처

# 10. 유품 분배 및 정리
class BelongingsDistribution(models.Model):
    will = models.OneToOneField(Will, on_delete=models.CASCADE)

    items_to_discard = models.TextField(blank=True, null=True)  # 버릴 것들 목록
    items_to_distribute = models.TextField(blank=True, null=True)  # 분배할 물건 목록