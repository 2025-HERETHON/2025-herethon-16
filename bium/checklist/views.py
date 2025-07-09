import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .models import ChecklistCategory, ChecklistItem, UserChecklist

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required


# 사용자 체크리스트 조회
@login_required
def checklist_view(request):
    categories = ChecklistCategory.objects.all()
    user = request.user
    result = []

    for category in categories:
        items = []
        for item in category.items.all():
            checked = UserChecklist.objects.filter(user=user, item=item, is_checked=True).exists()
            items.append({
                "id": item.id,
                "content": item.content,
                "is_checked": checked
            })
        result.append({
            "category": category.name,
            "items": items
        })

    return render(request, "checklist/checklist.html", {"data": result})


# 사용자 체크리스트 저장 
@login_required
def checklist_save_view(request):
    if request.method == "POST":
        checklist_ids = request.POST.getlist("checked_items")  # 체크된 항목의 id 리스트
        all_items = ChecklistItem.objects.all()

        for item in all_items:
            is_checked = str(item.id) in checklist_ids
            UserChecklist.objects.update_or_create(
                user=request.user,
                item=item,
                defaults={"is_checked": is_checked}
            )

        return redirect("checklist_view")  

    return redirect("checklist_view")


#초기 데이터 생성용
@csrf_exempt
def init_checklist_data(request):
    checklist_data = {
        "법적·행정적 준비": [
            "유언장 작성하기",
            "사전연명의료의향서 작성하기",
            "장기기증 등록 여부 결정하기",
            "묘지나 납골당 지정하기"
        ],
        "장례 방식 관련 준비": [
            "장례 형태 결정하기",
            "묘지/봉인당/수목장 등 장소 결정하기",
            "장례식장, 장례 대행업체 찾기",
            "장례 예산 추정하기"
        ],
        "재정·보험 관련": [
            "사망 보험/장례 보험 확인하기",
            "은행계좌/보험 수익자 지정하기",
            "디지털 자산 처리 방법 메모하기"
        ],
        "남겨질 사람들을 위한 준비": [
            "장례 시 연락할 사람 목록 작성하기",
            "마지막 인사 편지/영상 남기기",
            "추모 방법 공유하기"
        ],
        "일상 준비": [
            "반려동물/식물 돌봄 계획하기",
            "집 정리 및 유품 정리하기",
            "중요 비밀번호 관리하기"
        ]
    }

    for category_name, items in checklist_data.items():
        category, _ = ChecklistCategory.objects.get_or_create(name=category_name)
        for content in items:
            ChecklistItem.objects.get_or_create(category=category, content=content)

    return JsonResponse({"success": True, "message": "초기 체크리스트 생성 완료!"})

