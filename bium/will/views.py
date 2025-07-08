from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from datetime import datetime
# from weasyprint import HTML
from .models import *

def get_or_create_model(model, will):
    obj, created = model.objects.get_or_create(will=will)
    return obj

@login_required
@csrf_exempt
def basic_info_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            info = BasicInfo.objects.get(will=will)
            data = {
                "name": info.name,
                "birth_date": info.birth_date.isoformat() if info.birth_date else None,
                "gender": info.gender,
                "phone_number": info.phone_number,
                "birth_place": info.birth_place,
                "registered_domicile": info.registered_domicile,
                "current_diseases": info.current_diseases,
                "past_diseases": info.past_diseases,
                "constitution": info.constitution,
                "family_tree": info.family_tree,
            }
            return JsonResponse({"success": True, "data": data})
        except BasicInfo.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        defaults = {
            "name": request.POST.get("name", ""),
            "gender": request.POST.get("gender", ""),
            "phone_number": request.POST.get("phone_number", ""),
            "birth_place": request.POST.get("birth_place", ""),
            "registered_domicile": request.POST.get("registered_domicile", ""),
            "current_diseases": request.POST.get("current_diseases", ""),
            "past_diseases": request.POST.get("past_diseases", ""),
            "constitution": request.POST.get("constitution", ""),
            "family_tree": request.POST.get("family_tree", ""),
        }

        birth_date_str = request.POST.get("birth_date")
        if birth_date_str:
            try:
                defaults["birth_date"] = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass

        info = get_or_create_model(BasicInfo, will)
        for field, value in defaults.items():
            setattr(info, field, value)
        info.save()

        if will.progress_step < 1:
            will.progress_step = 1
            will.save()

        return JsonResponse({"success": True, "message": "1단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

@login_required
@csrf_exempt
def family_record_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            record = FamilyRecord.objects.get(will=will)
            data = {
                "mother_record": record.mother_record,
                "father_record": record.father_record,
                "siblings_record": record.siblings_record,
            }
            return JsonResponse({"success": True, "data": data})
        except FamilyRecord.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        record = get_or_create_model(FamilyRecord, will)
        fields = ["mother_record", "father_record", "siblings_record"]
        for field in fields:
            value = request.POST.get(field)
            if value is not None:
                setattr(record, field, value)
        record.save()

        if will.progress_step < 2:
            will.progress_step = 2
            will.save()

        return JsonResponse({"success": True, "message": "2단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

@login_required
@csrf_exempt
def about_me_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            record = AboutMe.objects.get(will=will)
            data = {
                "name_meaning": record.name_meaning,
                "nickname": record.nickname,
                "favorites": record.favorites,
                "preferences": record.preferences,
                "school_days": record.school_days,
                "work_and_social_life": record.work_and_social_life,
                "writings": record.writings,
            }
            return JsonResponse({"success": True, "data": data})
        except AboutMe.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        me = get_or_create_model(AboutMe, will)
        fields = ["name_meaning", "nickname", "favorites", "preferences",
                  "school_days", "work_and_social_life", "writings"]
        for field in fields:
            value = request.POST.get(field)
            if value is not None:
                setattr(me, field, value)
        me.save()

        if will.progress_step < 3:
            will.progress_step = 3
            will.save()

        return JsonResponse({"success": True, "message": "3단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

@login_required
@csrf_exempt
def pet_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            pet = Pet.objects.get(will=will)
            data = {
                "name": pet.name,
                "species": pet.species,
                "birth_date": pet.birth_date.isoformat() if pet.birth_date else None,
                "gender": pet.gender,
                "care": pet.care,
                "feeding": pet.feeding,
                "hospital": pet.hospital,
                "care_notes": pet.care_notes,
                "funeral_wishes": pet.funeral_wishes,
                "caretaker": pet.caretaker,
                "care_cost_plan": pet.care_cost_plan,
                "substitute_plan": pet.substitute_plan,
            }
            return JsonResponse({"success": True, "data": data})
        except Pet.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        defaults = {
            "name": request.POST.get("name", ""),
            "species": request.POST.get("species", ""),
            "gender": request.POST.get("gender", ""),
            "care": request.POST.get("care", ""),
            "feeding": request.POST.get("feeding", ""),
            "hospital": request.POST.get("hospital", ""),
            "care_notes": request.POST.get("care_notes", ""),
            "funeral_wishes": request.POST.get("funeral_wishes", ""),
            "caretaker": request.POST.get("caretaker", ""),
            "care_cost_plan": request.POST.get("care_cost_plan", ""),
            "substitute_plan": request.POST.get("substitute_plan", ""),
        }

        birth_date_str = request.POST.get("birth_date")
        if birth_date_str:
            try:
                defaults["birth_date"] = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass

        pet = get_or_create_model(Pet, will)
        for field, value in defaults.items():
            setattr(pet, field, value)
        pet.save()

        if will.progress_step < 4:
            will.progress_step = 4
            will.save()

        return JsonResponse({"success": True, "message": "4단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

@login_required
@csrf_exempt
def funeral_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            funeral = Funeral.objects.get(will=will)
            data = {
                "funeral_type": funeral.funeral_type,
                "invited_guests": funeral.invited_guests,
                "funeral_wishes": funeral.funeral_wishes,
                "grave_type": funeral.grave_type,
                "grave_preparation": funeral.grave_preparation,
                "tombstone_inscription": funeral.tombstone_inscription,
                "memorial_service_wishes": funeral.memorial_service_wishes,
            }
            return JsonResponse({"success": True, "data": data})
        except Funeral.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        defaults = {
            "funeral_type": request.POST.get("funeral_type", ""),
            "invited_guests": request.POST.get("invited_guests", ""),
            "funeral_wishes": request.POST.get("funeral_wishes", ""),
            "grave_type": request.POST.get("grave_type", ""),
            "grave_preparation": request.POST.get("grave_preparation", ""),
            "tombstone_inscription": request.POST.get("tombstone_inscription", ""),
            "memorial_service_wishes": request.POST.get("memorial_service_wishes", ""),
        }

        funeral = get_or_create_model(Funeral, will)
        for field, value in defaults.items():
            setattr(funeral, field, value)
        funeral.save()

        if will.progress_step < 5:
            will.progress_step = 5
            will.save()

        return JsonResponse({"success": True, "message": "5단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

@login_required
@csrf_exempt
def medical_care_preparation_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            medcare = MedicalCarePreparation.objects.get(will=will)
            data = {
                "terminal_illness": medcare.terminal_illness,
                "hospice_care": medcare.hospice_care,
                "life_sustaining_treatment": medcare.life_sustaining_treatment,
                "organ_and_tissue_donation": medcare.organ_and_tissue_donation,
            }
            return JsonResponse({"success": True, "data": data})
        except MedicalCarePreparation.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        defaults = {
            "terminal_illness": request.POST.get("terminal_illness", ""),
            "hospice_care": request.POST.get("hospice_care", ""),
            "life_sustaining_treatment": request.POST.get("life_sustaining_treatment", ""),
            "organ_and_tissue_donation": request.POST.get("organ_and_tissue_donation", ""),
        }

        medcare = get_or_create_model(MedicalCarePreparation, will)
        for field, value in defaults.items():
            setattr(medcare, field, value)
        medcare.save()

        if will.progress_step < 6:
            will.progress_step = 6
            will.save()

        return JsonResponse({"success": True, "message": "6단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)


@login_required
@csrf_exempt
def will_and_inheritance_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            inheritance = WillAndInheritance.objects.get(will=will)
            data = {
                "message_to_parents": inheritance.message_to_parents,
                "message_to_friends": inheritance.message_to_friends,
                "will_text": inheritance.will_text,
                "assets_and_distribution": inheritance.assets_and_distribution,
                "credit_card_list": inheritance.credit_card_list,
                "pension_and_insurance": inheritance.pension_and_insurance,
                "debts": inheritance.debts,
                "will_storage_location": inheritance.will_storage_location,
            }
            return JsonResponse({"success": True, "data": data})
        except WillAndInheritance.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        inheritance = get_or_create_model(WillAndInheritance, will)
        fields = ["message_to_parents", "message_to_friends", "will_text", "assets_and_distribution",
            "credit_card_list", "pension_and_insurance", "debts", "will_storage_location"]
        for field in fields:
            value = request.POST.get(field)
            if value is not None:
                setattr(inheritance, field, value)
        inheritance.save()

        if will.progress_step < 7:
            will.progress_step = 7
            will.save()

        return JsonResponse({"success": True, "message": "7단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)


@login_required
@csrf_exempt
def bucket_list_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            bucket = BucketList.objects.get(will=will)
            data = {"bucket_list": bucket.bucket_list}
            return JsonResponse({"success": True, "data": data})
        except BucketList.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        bucket = get_or_create_model(BucketList, will)
        bucket_list_value = request.POST.get("bucket_list")
        if bucket_list_value is not None:
            bucket.bucket_list = bucket_list_value
        bucket.save()

        if will.progress_step < 8:
            will.progress_step = 8
            will.save()

        return JsonResponse({"success": True, "message": "8단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)


@login_required
@csrf_exempt
def guardian_selection_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            guardian = GuardianSelection.objects.get(will=will)
            data = {
                "guardian_name": guardian.guardian_name,
                "guardian_contact": guardian.guardian_contact,
                "emergency_contact": guardian.emergency_contact,
            }
            return JsonResponse({"success": True, "data": data})
        except GuardianSelection.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        guardian = get_or_create_model(GuardianSelection, will)
        fields = ["guardian_name", "guardian_contact", "emergency_contact"]
        for field in fields:
            value = request.POST.get(field)
            if value is not None:
                setattr(guardian, field, value)
        guardian.save()

        if will.progress_step < 9:
            will.progress_step = 9
            will.save()

        return JsonResponse({"success": True, "message": "9단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)


@login_required
@csrf_exempt
def belongings_distribution_api(request):
    user = request.user
    will, _ = Will.objects.get_or_create(user=user)

    if request.method == "GET":
        try:
            belongings = BelongingsDistribution.objects.get(will=will)
            data = {
                "items_to_discard": belongings.items_to_discard,
                "items_to_distribute": belongings.items_to_distribute,
            }
            return JsonResponse({"success": True, "data": data})
        except BelongingsDistribution.DoesNotExist:
            return JsonResponse({"success": True, "data": {}})

    elif request.method == "POST":
        if request.POST.get("should_save") == "false":
            return JsonResponse({"success": True, "message": "저장 생략"})

        belongings = get_or_create_model(BelongingsDistribution, will)
        fields = ["items_to_discard", "items_to_distribute"]
        for field in fields:
            value = request.POST.get(field)
            if value is not None:
                setattr(belongings, field, value)
        belongings.save()

        if will.progress_step < 10:
            will.progress_step = 10
            will.save()

        return JsonResponse({"success": True, "message": "10단계 저장 완료"})

    return JsonResponse({"success": False, "message": "허용되지 않는 요청 방식입니다."}, status=405)

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

# @login_required
# def download_will_pdf(request):
#     user = request.user
#     will, _ = Will.objects.get_or_create(user=user)
#
#     context = {
#         "basic_info": BasicInfo.objects.filter(will=will).first(),
#         "family_record": FamilyRecord.objects.filter(will=will).first(),
#         "about_me": AboutMe.objects.filter(will=will).first(),
#         "pet": Pet.objects.filter(will=will).first(),
#         "funeral": Funeral.objects.filter(will=will).first(),
#         "medical_care_preparation": MedicalCarePreparation.objects.filter(will=will).first(),
#         "will_and_inheritance": WillAndInheritance.objects.filter(will=will).first(),
#         "bucket_list": BucketList.objects.filter(will=will).first(),
#         "guardian_selection": GuardianSelection.objects.filter(will=will).first(),
#         "belongings_distribution": BelongingsDistribution.objects.filter(will=will).first(),
#     }
#
#     html_string = render_to_string('will_pdf_template.html', context)
#     pdf_file = HTML(string=html_string).write_pdf()
#
#     response = HttpResponse(pdf_file, content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="will.pdf"'
#     return response