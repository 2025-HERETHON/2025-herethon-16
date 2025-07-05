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
            "background_image": space.background_image.url if space.background_image else None,
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
                "background_image": space.background_image.url if space.background_image else None,
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
        background_image = request.FILES.get("background_image")
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
            background_image=background_image,
            is_public=is_public,
        )

        return JsonResponse({
            "success": True,
            "message": "추모공간이 생성되었습니다.",
            "memorial_id": memorial.id
        }, status=201)
