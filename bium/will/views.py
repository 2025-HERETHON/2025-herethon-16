from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from datetime import datetime
from .models import *

def get_or_create_model(model, will):
    obj, created = model.objects.get_or_create(will=will)
    return obj

@login_required
@csrf_exempt
def basic_info_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    info = BasicInfo.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "name", "gender", "phone_number", "birth_place", "registered_domicile",
            "current_diseases", "past_diseases", "constitution", "family_tree"
        ]

        if not info:
            info = BasicInfo(will=will)

        for field in fields:
            value = request.POST.get(field)
            setattr(info, field, value if value != "" else None)

        birth_date_str = request.POST.get("birth_date")
        if birth_date_str:
            try:
                info.birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            except ValueError:
                context = {
                    "info": info,
                    "error_message": "생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해 주세요."
                }
                return render(request, 'step01.html', context)
        else:
            info.birth_date = None

        info.save()

        if will.progress_step < 1:
            will.progress_step = 1
            will.save()

        return redirect('step02')

    context = {"info": info}
    return render(request, 'step01.html', context)

@login_required
@csrf_exempt
def family_record_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    record = FamilyRecord.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = ["mother_record", "father_record", "siblings_record"]

        if not record:
            record = FamilyRecord(will=will)
        for field in fields:
            value = request.POST.get(field)
            setattr(record, field, value if value != "" else None)
        record.save()

        if will.progress_step < 2:
            will.progress_step = 2
            will.save()

        return redirect('step03')

    context = {"record": record}
    return render(request, 'step02.html', context)

@login_required
@csrf_exempt
def about_me_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    me = AboutMe.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "name_meaning", "nickname", "favorites", "preferences",
            "school_days", "work_and_social_life", "writings"
        ]

        if not me:
            me = AboutMe(will=will)
        for field in fields:
            value = request.POST.get(field)
            setattr(me, field, value if value != "" else None)
        me.save()

        if will.progress_step < 3:
            will.progress_step = 3
            will.save()

        return redirect('step04')

    context = {"me": me}
    return render(request, 'step03.html', context)

@login_required
@csrf_exempt
def pet_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    pet = Pet.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "name", "species", "gender", "care", "feeding", "hospital",
            "care_notes", "funeral_wishes", "caretaker", "care_cost_plan",
            "substitute_plan"
        ]

        if not pet:
            pet = Pet(will=will)

        for field in fields:
            value = request.POST.get(field)
            setattr(pet, field, value if value != "" else None)

        birth_date_str = request.POST.get("birth_date")
        if birth_date_str:
            try:
                pet.birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            except ValueError:
                context = {
                    "pet": pet,
                    "error_message": "생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해 주세요."
                }
                return render(request, 'step04.html', context)
        else:
            pet.birth_date = None

        pet.save()

        if will.progress_step < 4:
            will.progress_step = 4
            will.save()

        return redirect('step05')

    context = {"pet": pet}
    return render(request, 'step04.html', context)

@login_required
@csrf_exempt
def funeral_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    funeral = Funeral.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "funeral_type", "invited_guests", "funeral_wishes",
            "grave_type", "grave_preparation", "tombstone_inscription",
            "memorial_service_wishes"
        ]

        if not funeral:
            funeral = Funeral(will=will)

        for field in fields:
            value = request.POST.get(field)
            setattr(funeral, field, value if value != "" else None)

        funeral.save()

        if will.progress_step < 5:
            will.progress_step = 5
            will.save()

        return redirect('step06')

    context = {"funeral": funeral}
    return render(request, 'step05.html', context)

@login_required
@csrf_exempt
def medical_care_preparation_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    medcare = MedicalCarePreparation.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "terminal_illness",
            "hospice_care",
            "life_sustaining_treatment",
            "organ_and_tissue_donation",
        ]

        if not medcare:
            medcare = MedicalCarePreparation(will=will)

        for field in fields:
            value = request.POST.get(field)
            setattr(medcare, field, value if value != "" else None)

        medcare.save()

        if will.progress_step < 6:
            will.progress_step = 6
            will.save()

        return redirect('step07')

    context = {"medcare": medcare}
    return render(request, 'step06.html', context)


@login_required
@csrf_exempt
def will_and_inheritance_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    inheritance = WillAndInheritance.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        fields = [
            "message_to_parents", "message_to_friends", "will_text", "assets_and_distribution",
            "credit_card_list", "pension_and_insurance", "debts", "will_storage_location"
        ]

        if not inheritance:
            inheritance = WillAndInheritance(will=will)

        for field in fields:
            value = request.POST.get(field)
            setattr(inheritance, field, value if value != "" else None)

        inheritance.save()

        if will.progress_step < 7:
            will.progress_step = 7
            will.save()

        return redirect('step07')

    context = {"inheritance": inheritance}
    return render(request, 'step07.html', context)


@login_required
@csrf_exempt
def bucket_list_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    bucket = BucketList.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        if not bucket:
            bucket = BucketList(will=will)

        bucket_list_value = request.POST.get("bucket_list", "")
        bucket.bucket_list = bucket_list_value
        bucket.save()

        if will.progress_step < 8:
            will.progress_step = 8
            will.save()

        return redirect('step08')

    context = {"bucket": bucket}
    return render(request, 'step08.html', context)


@login_required
@csrf_exempt
def guardian_selection_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    guardian = GuardianSelection.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        if not guardian:
            guardian = GuardianSelection(will=will)

        fields = ["guardian_name", "guardian_contact", "emergency_contact"]

        for field in fields:
            value = request.POST.get(field)
            setattr(guardian, field, value if value != "" else None)

        guardian.save()

        if will.progress_step < 9:
            will.progress_step = 9
            will.save()

        return redirect('step09')

    context = {"guardian": guardian}
    return render(request, 'step09.html', context)


@login_required
@csrf_exempt
def belongings_distribution_view(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)
    belongings = BelongingsDistribution.objects.filter(will=will).first()

    if request.method == "POST":
        if request.POST.get("should_save") == "false":
            return redirect('main')

        if not belongings:
            belongings = BelongingsDistribution(will=will)

        fields = ["items_to_discard", "items_to_distribute"]

        for field in fields:
            value = request.POST.get(field)
            setattr(belongings, field, value if value != "" else None)

        belongings.save()

        if will.progress_step < 10:
            will.progress_step = 10
            will.save()

        return redirect('step10')

    context = {"belongings": belongings}
    return render(request, 'step10.html', context)

@login_required
@csrf_exempt
@require_POST
def reset_will_data_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    # 각 단계 모델 삭제 (존재할 경우)
    BasicInfo.objects.filter(will=will).delete()
    FamilyRecord.objects.filter(will=will).delete()
    AboutMe.objects.filter(will=will).delete()
    Pet.objects.filter(will=will).delete()
    Funeral.objects.filter(will=will).delete()
    MedicalCarePreparation.objects.filter(will=will).delete()
    WillAndInheritance.objects.filter(will=will).delete()
    BucketList.objects.filter(will=will).delete()
    GuardianSelection.objects.filter(will=will).delete()
    BelongingsDistribution.objects.filter(will=will).delete()

    # 진행 단계도 초기화
    will.progress_step = 0
    will.save()

    return JsonResponse({"success": True, "message": "작성한 내용이 삭제되었습니다."})

@login_required
@csrf_exempt
def progress_step_api(request):
    will, _ = Will.objects.get_or_create(user=request.user)
    return JsonResponse({"success": True, "progress_step": will.progress_step})

@login_required
@csrf_exempt
@require_POST
def complete_will_api(request):
    will, _ = Will.objects.get_or_create(user=request.user)
    will.is_completed = True
    will.save()
    return JsonResponse({"success": True, "message": "유언장 작성 완료"})

def will_submit_view(request):
    return render(request, 'will_submit.html')