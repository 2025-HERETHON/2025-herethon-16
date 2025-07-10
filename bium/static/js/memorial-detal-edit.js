// — mock API data —
const mockUser = {
  name:       "김이름",
  birth_date: "2000-01-01",
  death_date: "2025-05-05",
  description:"내가 없을 때, 이곳에서 나를 만나주세요."
};

document.addEventListener('DOMContentLoaded', () => {
  // 필드 참조
  const inName   = document.getElementById('memorialName');
  const inBirth  = document.getElementById('birthDate');
  const inDeath  = document.getElementById('deathDate');
  const inDesc   = document.getElementById('description');

  const coverFrame   = document.getElementById('coverFrame');
  const coverInput   = document.getElementById('coverInput');
  const profileBtn   = document.getElementById('profileUploadBtn');
  const profileInput = document.getElementById('profileInput');
  const profileImg   = document.getElementById('profileImg');

  const saveBtn = document.getElementById('saveBtn');
  const btnBack = document.querySelector('.btn-back');

  // 1) 초기값 세팅
  inName.value         = mockUser.name;
  inBirth.value        = mockUser.birth_date;
  inDeath.value        = mockUser.death_date;
  inDesc.textContent   = mockUser.description;

  // 2) Cover 업로드
  coverFrame.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    coverFrame.style.background =
      `linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 80%),
       url(${url}) center/cover no-repeat`;
  });

  // 3) Profile 업로드
  profileBtn.addEventListener('click', () => profileInput.click());
  profileInput.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    profileImg.src = URL.createObjectURL(f);
  });

  // 4) 저장 버튼
  saveBtn.addEventListener('click', () => {
    alert('추모공간이 수정 완료되었습니다.');
    // 실제 API 호출 후 리다이렉트:
    // window.location.href = 'memorial-page.html';
  });

  // 5) 뒤로가기
  btnBack.addEventListener('click', () => {
    window.location.href = 'memorial-page.html';
  });
});
