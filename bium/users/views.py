import json
import re
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def signup_api(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST 요청만 허용됩니다."}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "message": "잘못된 JSON 형식입니다."}, status=400)

    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    birth_date_str = data.get("birth_date")
    phone_number = data.get("phone_number")

    if not all([username, password, name, birth_date_str, phone_number]):
        return JsonResponse({"success": False, "message": "모든 항목을 입력해 주세요."}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"success": False, "message": "이미 존재하는 아이디입니다."}, status=409)

    if len(username) < 4:
        return JsonResponse({"success": False, "message": "아이디는 4자 이상 작성해 주세요."}, status=400)

    if len(password) < 6 or not (re.search(r'[A-Za-z]', password) and re.search(r'\d', password)):
        return JsonResponse({"success": False, "message": "비밀번호는 영문과 숫자를 포함하여 6자 이상 작성해 주세요."}, status=400)

    try:
        birth_date = datetime.datetime.strptime(birth_date_str, "%Y-%m-%d").date()
        if birth_date > datetime.date.today():
            return JsonResponse({"success": False, "message": "올바른 생년월일이 아닙니다."}, status=400)
    except ValueError:
        return JsonResponse({"success": False, "message": "생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해 주세요."}, status=400)

    phone_pattern = re.compile(r'^01[016789]-\d{3,4}-\d{4}$')
    if not phone_pattern.match(phone_number):
        return JsonResponse({"success": False, "message": "휴대전화 번호 형식이 올바르지 않습니다. 010-1234-5678 형식으로 입력해 주세요."}, status=400)

    user = User.objects.create_user(username=username, password=password, name=name, birth_date=birth_date, phone_number=phone_number)
    user.is_active = True
    user.save()

    return JsonResponse({"success": True, "message": "회원가입에 성공했습니다."})