# 2025-herethon-16
2025 여기톤 : HER+ETHON 16팀

 - **서비스 개요** <br/>
   '언젠가, 누구나 맞이할 '죽음'이라는 순간을 우리는 과연 얼마나 준비하고 있을까?' 이 물음으로 부터 '비움'은 출발한다. '비움'은 누구나 맞이할 죽음을 더 이상 먼 이야기로 미루지 않도록 돕는 서비스입니다. 전통적 가족 형태가 변화하며, 1인 가구·비혼·동거 등 다양한 삶의 방식이 보편화된 오늘날, 죽음을 스스로 준비하는 필요성은 더욱 커지고 있습니다.
   이처럼 변화하는 시대 속에서, 누구나 간편하게 나의 죽음과 타인의 죽음을 준비할 수 있도록 ‘비움’이라는 서비스를 기획했다.
   비움의 주요 기능은 총 두 가지로, 첫째는 '디지철 유언장 작성'이고 둘째는 '온라인 추모공간'이다. '디지털 유언장 작성' 기능은 10단계로 구성되어 기본 정보, 유언, 상속, 후견인 선택 등 죽음을 사유할 수 있는 틀을 제시한다. 법적 효력은 없으며 자필 작성을 권장하며 마무리된다.
   '온라인 추모공간' 기능은 말 그대로 내 지인과 제 3자의 죽음을 추모할 수 있는 기능이다. 만들어진 추모공간에서는 헌화와 함께 조문 메시지를 작성할 수 있도록 구성했다.

 - **기술 스택** <br/>
   <span>프론트엔드: </span> 
   <img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

   <span>백엔드: </span>
   <img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=Django&logoColor=white">

   <span>기획·디자인: </span> <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

 - **팀원 소개** 
  <table border="" cellspacing="0" cellpadding="0" width="100%">
    <tr width="100%">
      <td align="center" width="190px"><a href="https://github.com/seunghyeonKang">강승현</a></td>
      <td  align="center" width="190px"><a href="https://github.com/kniiiiko">전지은</a></td>
      <td align="center" width="190px"><a href="https://github.com/Y0ungo">이예영</a></td>
      <td align="center" width="190px"><a href="https://github.com/rrinny">박채린</a></td>
      <td  align="center" width="190px"><a href="https://github.com/hyeonky0w0">이현경</a></td>
    </tr>
    <tr width="100%">
      <td  align="center">기획·디자인</td>
      <td  align="center">프론트엔드</td>
      <td  align="center">프론트엔드</td>
      <td  align="center">백엔드</td>
      <td  align="center">백엔드</td>
    </tr>
    <tr width="100%">
      <td  align="center"><p>서비스 기획</p><p>UI, UX 디자인</p><p>프로젝트 총괄</p></td>
      <td  align="center"><p>회원가입/로그인 <br>페이지 개발</p><p>유언장 작성<br>페이지 개발</p></td>
      <td  align="center"><p>메인 페이지 개발</p><p>추모공간<br>페이지 개발</p></td>
      <td  align="center"><p>회원가입/로그인 <br>기능 개발</p><p>유언장 작성<br>기능 개발</p></td>
      <td  align="center"><p>체크리스트<br>기능 개발</p><p>추모공간 기능 개발</p></td>
    </tr>
  </table>

  - **폴더 구조**
    ```
    📂 2025-herethon-16
    └─ bium
     ├─ checklist
     │  ├─ __init__.py
     │  ├─ admin.py
     │  ├─ apps.py
     │  ├─ models.py
     │  ├─ tests.py
     │  ├─ urls.py
     │  └─ views.py
     ├─ config
     │  ├─ __init__.py
     │  ├─ asgi.py
     │  ├─ settings.py
     │  ├─ urls.py
     │  └─ wsgi.py
     ├─ media
     ├─ memorial
     │  ├─ __init__.py
     │  ├─ admin.py
     │  ├─ apps.py
     │  ├─ models.py
     │  ├─ tests.py
     │  ├─ urls.py
     │  └─ views.py
     ├─ static
     │  ├─ css
     │  └─ js
     ├─ templates
     ├─ users
     │  ├─ __init__.py
     │  ├─ admin.py
     │  ├─ apps.py
     │  ├─ models.py
     │  ├─ tests.py
     │  ├─ urls.py
     │  └─ views.py
     ├─ will
     │  ├─ __init__.py
     │  ├─ admin.py
     │  ├─ apps.py
     │  ├─ models.py
     │  ├─ tests.py
     │  ├─ urls.py
     │  └─ views.py
     └─ manage.py
    ```

- **개발 환경에서의 실행 방법**
    ```
    $ python manage.py runserver
    ```
