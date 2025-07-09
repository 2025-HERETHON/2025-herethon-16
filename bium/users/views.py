import re
import datetime
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model

User = get_user_model()

@csrf_exempt
def signup_view(request):
    if request.method == "GET":
        return render(request, 'signup.html')

    username = request.POST.get("username")
    password = request.POST.get("password")
    name = request.POST.get("name")
    birth_date_str = request.POST.get("birth_date")
    phone_number = request.POST.get("phone_number")

    if not all([username, password, name, birth_date_str, phone_number]):
        return render(request, 'signup.html', {"error": "모든 항목을 입력해 주세요."})

    if User.objects.filter(username=username).exists():
        return render(request, 'signup.html', {"error": "이미 존재하는 아이디입니다."})

    if len(username) < 4:
        return render(request, 'signup.html', {"error": "아이디는 4자 이상 작성해 주세요."})

    if len(password) < 6 or not (re.search(r'[A-Za-z]', password) and re.search(r'\d', password)):
        return render(request, 'signup.html', {"error": "비밀번호는 영문과 숫자를 포함하여 6자 이상 작성해 주세요."})

    try:
        birth_date = datetime.datetime.strptime(birth_date_str, "%Y-%m-%d").date()
        if birth_date > datetime.date.today():
            return render(request, 'signup.html', {"error": "올바른 생년월일이 아닙니다."})
    except ValueError:
        return render(request, 'signup.html', {"error": "생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해 주세요."})

    phone_pattern = re.compile(r'^01[016789]-\d{3,4}-\d{4}$')
    if not phone_pattern.match(phone_number):
        return render(request, 'signup.html', {"error": "휴대전화 번호 형식이 올바르지 않습니다. 010-1234-5678 형식으로 입력해 주세요."})

    user = User.objects.create_user(username=username, password=password, name=name, birth_date=birth_date, phone_number=phone_number)
    user.is_active = True
    user.save()

    return redirect('login')

@csrf_exempt
def login_view(request):
    if request.method == "GET":
        return render(request, 'login.html')

    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
        return render(request, 'login.html', {"error": "아이디와 비밀번호를 모두 입력해 주세요."})

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return redirect('/')
    else:
        return render(request, 'login.html', {"error": "아이디나 비밀번호가 올바르지 않습니다."})

def main_view(request):
    return render(request, 'main-page.html')