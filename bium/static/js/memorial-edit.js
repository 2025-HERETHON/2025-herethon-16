// isNew = true(작성) / false(수정)
const isNew = true;
document.getElementById('saveBtn')
        .textContent = isNew ? '작성 완료' : '수정 완료';

// 배경 업로드
const coverFrame = document.getElementById('coverFrame');
const coverInput = document.getElementById('coverInput');
coverFrame.addEventListener('click', () => coverInput.click());

coverInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const blobUrl = URL.createObjectURL(f);

  // 그라디언트(항상 앞) + 업로드된 이미지(뒤)를 한 번에 지정
  coverFrame.style.background =
    `linear-gradient(
       180deg,
       rgba(255,255,255,0) 0%,
       rgba(255,255,255,1) 80%
     ),
     url(${blobUrl})
     center/cover no-repeat`;
});


// 프로필 업로드
const profileFrame = document.getElementById('profileFrame');
const profileInput = document.getElementById('profileInput');
const profileImg   = document.getElementById('profileImg');
const profileImgUrl = window.profileImageUrl || null;
const coverImgUrl = window.coverImageUrl || null;
profileFrame.addEventListener('click', () => profileInput.click());
profileInput.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  profileImg.src = URL.createObjectURL(f);
});

// 날짜 표시
const birthDate   = document.getElementById('birthDate');
const deathDate   = document.getElementById('deathDate');
const dateDisplay = document.getElementById('dateDisplay');

// function fmt(input) {
//   const d = new Date(input);
//   return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
// }
function updateDates() {
  if (birthDate.value && deathDate.value) {
    dateDisplay.textContent = `${fmt(birthDate.value)} – ${fmt(deathDate.value)}`;
    dateDisplay.classList.remove('hidden');
  } else {
    dateDisplay.classList.add('hidden');
  }
}
birthDate.addEventListener('change', updateDates);
deathDate.addEventListener('change', updateDates);

// 저장 액션
document.getElementById('saveBtn').addEventListener('click', () => {
  alert(isNew ? '추모공간이 생성되었습니다.' : '추모공간이 수정되었습니다.');
});

// 뒤로가기 버튼 클릭 시 이동
document.querySelector('.btn-back').addEventListener('click', () => {
  window.location.href = 'memorial-page.html';
});

// 프로필 이미지 fallback 처리
if (profileImgUrl) {
  profileImg.src = profileImgUrl;
  profileImg.onerror = () => {
    profileImg.src = '../static/images/assets/default.png';
  };
} else {
  profileImg.src = '../static/images/assets/default.png';
}

// 배경 커버 이미지 fallback 처리
if (coverImgUrl) {
  const img = new Image();
  img.onload = () => {
    coverFrame.style.background =
      `linear-gradient(
         180deg,
         rgba(255,255,255,0) 0%,
         rgba(255,255,255,1) 80%
       ),
       url(${coverImgUrl})
       center/cover no-repeat`;
  };
  img.onerror = () => {
    setDefaultCover();
  };
  img.src = coverImgUrl;
} else {
  setDefaultCover();
}

function setDefaultCover() {
  coverFrame.style.background =
    `linear-gradient(
       180deg,
       rgba(255,255,255,0) 0%,
       rgba(255,255,255,1) 80%
     ),
     url('../static/images/assets/background-combined.png')
     center/cover no-repeat`;
}

// 저장 버튼 누르면 memorial-detail.html로 리다이렉트
document.getElementById('saveBtn').addEventListener('click', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const memorialId = urlParams.get('memorial_id');
  alert(isNew ? '추모공간이 생성되었습니다.' : '추모공간이 수정되었습니다.');
  
  if (!isNew && memorialId) {
    window.location.href = `memorial-detail.html?memorial_id=${memorialId}`;
  } else {
    window.location.href = 'memorial-page.html';
  }
});

