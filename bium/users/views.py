import re
import datetime
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.views.decorators.http import require_GET

User = get_user_model()

@csrf_exempt
def signup_api(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST 요청만 허용됩니다."}, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")
    name = request.POST.get("name")
    birth_date_str = request.POST.get("birth_date")
    phone_number = request.POST.get("phone_number")

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

@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "POST 요청만 허용됩니다."}, status=405)

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return JsonResponse({"success": False, "message": "아이디와 비밀번호를 모두 입력해 주세요."}, status=400)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({"success": True, "message": "로그인에 성공했습니다."})
    else:
        return JsonResponse({"success": False, "message": "아이디나 비밀번호가 올바르지 않습니다."}, status=401)

@require_GET
def check_login_api(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "success": True,
            "message": "로그인 상태입니다.",
            "user": {
                "username": request.user.username,
                "name": request.user.name,
                "birth_date": request.user.birth_date.strftime("%Y-%m-%d") if request.user.birth_date else None,
                "phone_number": request.user.phone_number,
            }
        })
    else:
        return JsonResponse({"success": False, "message": "로그인 상태가 아닙니다."}, status=401)

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    return render(request, 'signup.html')