import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import MemorialSpace
from datetime import datetime

# 공개 추모공간 리스트 확인 기능
@csrf_exempt
@require_http_methods(["GET"])
def public_memorial_list_api(request):
    spaces = MemorialSpace.objects.filter(is_public=True).order_by('-created_at')
    data = []
    for space in spaces:
        data.append({
            "id": space.id,
            "name": space.name,
            "description": space.description,
            "birth_date": space.birth_date.isoformat() if space.birth_date else None,
            "death_date": space.death_date.isoformat() if space.death_date else None,
            "profile_image": space.profile_image.url if space.profile_image else None,
            "created_at": space.created_at.isoformat()
        })
    return JsonResponse({"success": True, "memorials": data})


# 내 추모공간 리스트 확인 ／ 작성（생성） 기능
@csrf_exempt
@require_http_methods(["GET", "POST"])
def my_memorial_space_api(request):
    
    # 비로그인 시 401 
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "로그인이 필요합니다."}, status=401)

    user = request.user

    if request.method == "GET":
        # 내 추모공간 리스트 확인
        spaces = MemorialSpace.objects.filter(creator=user)
        data = []
        for space in spaces:
            data.append({
                "id": space.id,
                "name": space.name,
                "description": space.description,
                "birth_date": space.birth_date.isoformat() if space.birth_date else None,
                "death_date": space.death_date.isoformat() if space.death_date else None,
                "profile_image": space.profile_image.url if space.profile_image else None,
                "created_at": space.created_at.isoformat()
            })
        return JsonResponse({"success": True, "memorials": data})

    elif request.method == "POST":
        # 추모공간 생성
        name = request.POST.get("name")
        description = request.POST.get("description")
        birth_date_str = request.POST.get("birth_date")
        death_date_str = request.POST.get("death_date")
        profile_image = request.FILES.get("profile_image")
        is_public = request.POST.get("is_public", "true").lower() == "true"

        birth_date = None
        death_date = None

        if not name or not description:
            return JsonResponse({"success": False, "message": "이름과 설명은 필수입니다."}, status=400)

        try:
            if birth_date_str:
                birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            if death_date_str:
                death_date = datetime.strptime(death_date_str, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({"success": False, "message": "날짜 형식이 올바르지 않습니다. YYYY-MM-DD로 보내주세요."}, status=400)

        memorial = MemorialSpace.objects.create(
            creator=user,
            name=name,
            description=description,
            birth_date=birth_date or None,
            death_date=death_date or None,
            profile_image=profile_image,
            is_public=is_public,
        )

        return JsonResponse({
            "success": True,
            "message": "추모공간이 생성되었습니다.",
            "memorial_id": memorial.id
        }, status=201)


# 내 추모공간 수정 ／ 삭제 기능
@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def update_delete_my_memorial_space_api(request, memorial_id):
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "로그인이 필요합니다."}, status=401)

    try:
        space = MemorialSpace.objects.get(id=memorial_id)
    except MemorialSpace.DoesNotExist:
        return JsonResponse({"success": False, "message": "존재하지 않는 추모공간입니다."}, status=404)

    if space.creator != request.user:
        return JsonResponse({"success": False, "message": "권한이 없습니다."}, status=403)

    if request.method == "PUT":
        data = json.loads(request.body)
        new_name = data.get("name")
        new_description = data.get("description")
        birth_date = data.get("birth_date")
        death_date = data.get("death_date")
        space.is_public = data.get("is_public", str(space.is_public)).lower() == "true"

        if not new_name or not new_description:
            return JsonResponse({"success": False, "message": "이름과 설명은 필수입니다."}, status=400)
        
        space.name = new_name
        space.description = new_description

        try:
            if birth_date:
                space.birth_date = datetime.strptime(birth_date, "%Y-%m-%d").date()
            if death_date:
                space.death_date = datetime.strptime(death_date, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({"success": False, "message": "날짜 형식 오류 (YYYY-MM-DD)."}, status=400)

        space.save()
        return JsonResponse({"success": True, "message": "추모공간이 수정되었습니다."}, status=200)

    elif request.method == "DELETE":
        space.delete()
        return JsonResponse({"success": True, "message": "추모공간이 삭제되었습니다."}, status=200)




#추모공간 댓글 확인, 작성
@csrf_exempt
@require_http_methods(["GET", "POST"])
def condolence_message_api(request, memorial_id):
    from .models import CondolenceMessage, MemorialSpace

    try:
        space = MemorialSpace.objects.get(id=memorial_id)
    except MemorialSpace.DoesNotExist:
        return JsonResponse({"success": False, "message": "존재하지 않는 추모공간입니다."}, status=404)

    if request.method == "GET":
        #댓글 확인
        messages = CondolenceMessage.objects.filter(memorial_space=space).order_by('-created_at')
        message_list = []
        for m in messages:
            message_list.append({
                "id": m.id,
                "writer": m.writer.username,
                "message": m.message,
                "flower_image": m.flower_image if m.flower_image else None,
                "created_at": m.created_at.isoformat()
            })
        return JsonResponse({"success": True, "messages": message_list})

    elif request.method == "POST":
        #댓글 생성
        if not request.user.is_authenticated:
            return JsonResponse({"success": False, "message": "로그인이 필요합니다."}, status=401)

        message = request.POST.get("message")
        flower_image = request.POST.get("flower_image")

        if not message:
            return JsonResponse({"success": False, "message": "메시지는 필수입니다."}, status=400)

        CondolenceMessage.objects.create(
            memorial_space=space,
            writer=request.user,
            message=message,
            flower_image=flower_image,
        )

        return JsonResponse({"success": True, "message": "조문 메시지가 등록되었습니다."}, status=201)

    

#추모공간 댓글 수정, 삭제
@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def condolence_update_delete_api(request, message_id):
    from .models import CondolenceMessage

    try:
        message = CondolenceMessage.objects.get(id=message_id)
    except CondolenceMessage.DoesNotExist:
        return JsonResponse({"success": False, "message": "존재하지 않는 댓글입니다."}, status=404)

    # 인증 확인
    if not request.user.is_authenticated:
        return JsonResponse({"success": False, "message": "로그인이 필요합니다."}, status=401)

    # 작성자 본인만 수정/삭제 가능
    if message.writer != request.user:
        return JsonResponse({"success": False, "message": "권한이 없습니다."}, status=403)

    if request.method == "PUT":
        data = json.loads(request.body)
        new_message = data.get("message")
        new_flower = data.get("flower_image")

        if not new_message:
            return JsonResponse({"success": False, "message": "메시지는 필수입니다."}, status=400)

        message.message = new_message
        message.flower_image = new_flower
        message.save()

        return JsonResponse({"success": True, "message": "조문 메시지가 수정되었습니다."},status=200)

    elif request.method == "DELETE":
        message.delete()
        return JsonResponse({"success": True, "message": "조문 메시지가 삭제되었습니다."},status =200)
