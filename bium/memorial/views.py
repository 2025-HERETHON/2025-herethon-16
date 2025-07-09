import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from .models import MemorialSpace, CondolenceMessage
from datetime import datetime
from django.utils import timezone
from django.db.models import Q
import uuid

from django.shortcuts import render, redirect, get_object_or_404

# 공개 추모공간 리스트 확인 기능 + 검색 기능
@require_http_methods(["GET"])
def public_memorial_list_view(request):
    query = request.GET.get('q', '')
    
    spaces = MemorialSpace.objects.filter(is_public=True)
    
    if query:
        spaces = spaces.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )

    spaces = spaces.order_by('-created_at')

    return render(request, "memorial/public_list.html", {"spaces": spaces, "query": query})



#단일 추모공간 조회
@require_http_methods(["GET"])
def memorial_detail_view(request, memorial_id):
    try:
        space = MemorialSpace.objects.get(id=memorial_id)
    except MemorialSpace.DoesNotExist:
        return JsonResponse({"success": False, "message": "해당 추모공간이 존재하지 않습니다."}, status=404)

    #space = get_object_or_404(MemorialSpace, id=memorial_id)
    return render(request, "memorial/detail.html", {"space": space})



# 내 추모공간 리스트 확인 ／ 작성（생성） 기능
@login_required
def my_memorial_space_view(request):
    user = request.user

    if request.method == "POST":
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
            return render(request, "memorial/my_list.html", {
                "spaces": MemorialSpace.objects.filter(creator=user),
                "error": "이름과 설명은 필수입니다."
            })

        try:
            if birth_date_str:
                birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            if death_date_str:
                death_date = datetime.strptime(death_date_str, "%Y-%m-%d").date()
        except ValueError:
            return render(request, "memorial/my_list.html", {
                "spaces": MemorialSpace.objects.filter(creator=user),
                "error": "날짜 형식이 올바르지 않습니다. YYYY-MM-DD로 입력해주세요."
            })

        MemorialSpace.objects.create(
            creator=user,
            name=name,
            description=description,
            birth_date=birth_date,
            death_date=death_date,
            profile_image=profile_image,
            background_image=background_image,
            is_public=is_public,
        )

        return redirect("my_memorial_space_view")

    # GET 요청 시: 내 추모공간 목록 보기
    spaces = MemorialSpace.objects.filter(creator=user).order_by("-created_at")
    return render(request, "memorial/my_list.html", {"spaces": spaces})


# 내 추모공간 수정 기능
@login_required
def memorial_edit_view(request, memorial_id):
    space = get_object_or_404(MemorialSpace, id=memorial_id, creator=request.user)

    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        birth_date_str = request.POST.get("birth_date")
        death_date_str = request.POST.get("death_date")
        is_public = request.POST.get("is_public", "true").lower() == "true"

        if not name or not description:
            return render(request, "memorial/edit.html", {
                "space": space,
                "error": "이름과 설명은 필수입니다."
            })

        try:
            if birth_date_str:
                space.birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
            else:
                space.birth_date = None

            if death_date_str:
                space.death_date = datetime.strptime(death_date_str, "%Y-%m-%d").date()
            else:
                space.death_date = None
        except ValueError:
            return render(request, "memorial/edit.html", {
                "space": space,
                "error": "날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)."
            })

        space.name = name
        space.description = description
        space.is_public = is_public
        space.save()

        return redirect("my_memorial_space_view")  # 목록으로 리다이렉트

    return render(request, "memorial/edit.html", {"space": space})


# 내 추모공간 삭제 기능
@login_required
def memorial_delete_view(request, memorial_id):
    space = get_object_or_404(MemorialSpace, id=memorial_id, creator=request.user)

    if request.method == "POST":
        space.delete()
        return redirect("my_memorial_space_view")

    return render(request, "memorial/confirm_delete.html", {"space": space})



#추모공간 댓글 확인, 작성
@require_http_methods(["GET", "POST"])
def condolence_message_view(request, memorial_id):
    space = get_object_or_404(MemorialSpace, id=memorial_id)

    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("login")  # 로그인 페이지로 보냄

        message = request.POST.get("message")
        flower_image = request.POST.get("flower_image")

        if message:
            CondolenceMessage.objects.create(
                memorial_space=space,
                writer=request.user,
                message=message,
                flower_image=flower_image,
            )
            return redirect("condolence_message_view", memorial_id=memorial_id)
        else:
            error = "메시지는 필수입니다."
    else:
        error = None

    messages = CondolenceMessage.objects.filter(memorial_space=space).order_by("-created_at")

    return render(request, "memorial/condolence_message_view.html", {
        "space": space,
        "messages": messages,
        "error": error,
    })
    


#추모공간 댓글 수정
@login_required
def condolence_edit_view(request, message_id):
    message = get_object_or_404(CondolenceMessage, id=message_id)

    if message.writer != request.user:
        return redirect("condolence_message_view", memorial_id=message.memorial_space.id)

    if request.method == "POST":
        new_message = request.POST.get("message")
        new_flower = request.POST.get("flower_image")

        if not new_message:
            return render(request, "memorial/condolence_edit.html", {
                "message_obj": message,
                "error": "메시지는 필수입니다.",
            })

        message.message = new_message
        message.flower_image = new_flower
        message.save()

        return redirect("condolence_message_view", memorial_id=message.memorial_space.id)

    return render(request, "memorial/condolence_edit.html", {"message_obj": message})

#추모공간 댓글 삭제
@login_required
def condolence_delete_view(request, message_id):
    message = get_object_or_404(CondolenceMessage, id=message_id)

    if message.writer != request.user:
        return redirect("condolence_message_view", memorial_id=message.memorial_space.id)

    if request.method == "POST":
        memorial_id = message.memorial_space.id
        message.delete()
        return redirect("condolence_message_view", memorial_id=memorial_id)

    return render(request, "memorial/condolence_confirm_delete.html", {"message_obj": message})



#대리인 링크 생성
@login_required
def generate_agent_link_view(request, memorial_id):
    space = get_object_or_404(MemorialSpace, id=memorial_id, creator=request.user)

    if request.method == "POST":
        # 토큰 생성/갱신
        space.agent_token = uuid.uuid4()
        space.agent_assigned_at = timezone.now()
        space.save()

        agent_link = f"{request.scheme}://{request.get_host()}/memorials/agent/{space.agent_token}/"

        return render(request, "memorial/agent_link.html", {
            "space": space,
            "agent_link": agent_link,
            "issued_at": space.agent_assigned_at,
        })

    # GET 요청일 경우: 링크 발급 버튼 보여주기
    return render(request, "memorial/agent_link.html", {"space": space})


#대리인 링크 접근
@require_http_methods(["GET"])
def agent_access_view(request, agent_token):
    space = get_object_or_404(MemorialSpace, agent_token=agent_token)

    return render(request, "memorial/agent_access.html", {
        "space": space
    })