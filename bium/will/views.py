import json
from django.http import JsonResponse
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from datetime import date, datetime
# from weasyprint import HTML
from .models import *

def get_or_create_model(model, will):
    obj, created = model.objects.get_or_create(will=will)
    return obj

def should_skip_save(data):
    return data.get("should_save") is False

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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        info = get_or_create_model(BasicInfo, will)
        for field in [
            "name", "gender", "phone_number", "birth_place",
            "registered_domicile", "current_diseases", "past_diseases",
            "constitution", "family_tree"
        ]:
            if field in data:
                setattr(info, field, data[field])

        if "birth_date" in data:
            date_str = data["birth_date"]
            try:
                info.birth_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                pass

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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        record = get_or_create_model(FamilyRecord, will)
        for field in ["mother_record", "father_record", "siblings_record"]:
            if field in data:
                setattr(record, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        me = get_or_create_model(AboutMe, will)
        for field in ["name_meaning", "nickname", "favorites", "preferences",
                      "school_days", "work_and_social_life", "writings"]:
            if field in data:
                setattr(me, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        pet = get_or_create_model(Pet, will)
        for field in ["name", "species", "gender", "care", "feeding", "hospital",
                      "care_notes", "funeral_wishes", "caretaker", "care_cost_plan", "substitute_plan"]:
            if field in data:
                setattr(pet, field, data[field])

        if "birth_date" in data:
            date_str = data["birth_date"]
            try:
                pet.birth_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                pass

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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        funeral = get_or_create_model(Funeral, will)
        for field in [
            "funeral_type", "invited_guests", "funeral_wishes", "grave_type",
            "grave_preparation", "tombstone_inscription", "memorial_service_wishes"
        ]:
            if field in data:
                setattr(funeral, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        medcare = get_or_create_model(MedicalCarePreparation, will)
        for field in ["terminal_illness", "hospice_care", "life_sustaining_treatment", "organ_and_tissue_donation"]:
            if field in data:
                setattr(medcare, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        inheritance = get_or_create_model(WillAndInheritance, will)
        for field in [
            "message_to_parents", "message_to_friends", "will_text", "assets_and_distribution",
            "credit_card_list", "pension_and_insurance", "debts", "will_storage_location"
        ]:
            if field in data:
                setattr(inheritance, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        bucket = get_or_create_model(BucketList, will)
        if "bucket_list" in data:
            bucket.bucket_list = data["bucket_list"]
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        guardian = get_or_create_model(GuardianSelection, will)
        for field in ["guardian_name", "guardian_contact", "emergency_contact"]:
            if field in data:
                setattr(guardian, field, data[field])
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
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "잘못된 JSON입니다."}, status=400)

        if should_skip_save(data):
            return JsonResponse({"success": True, "message": "저장 생략"})

        belongings = get_or_create_model(BelongingsDistribution, will)
        for field in ["items_to_discard", "items_to_distribute"]:
            if field in data:
                setattr(belongings, field, data[field])
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