// — mock API data —
// 실제 호출 전까지 이곳에 사용자 정보를 넣어두고 씁니다.
const mockUser = {
  name:       "김이름",
  birth_date: "2000-01-01",
  // background, profile 은 업로드 전엔 CSS에서 기본값 사용
};

// — Topbar title 채우기 —
const topbarTitle = document.getElementById('topbarTitle');
topbarTitle.textContent = `${mockUser.name} 님의 추모공간`;

// — 폼 기본값 세팅 —
document.getElementById('memorialName').value = mockUser.name;
document.getElementById('birthDate').value    = mockUser.birth_date;

// — 뒤로가기 —
document.querySelector('.btn-back').addEventListener('click', () => {
  window.location.href = 'mymemorial.html';
});

// — COVER 업로드 —
const coverFrame = document.getElementById('coverFrame');
const coverInput = document.getElementById('coverInput');

coverFrame.addEventListener('click', () => coverInput.click());
coverInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  coverFrame.style.backgroundImage =
    `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), url(${url})`;
});

// — PROFILE 업로드 —
const profileFrame = document.getElementById('profileFrame');
const profileInput = document.getElementById('profileInput');
const profileImg   = document.getElementById('profileImg');

profileFrame.addEventListener('click', () => profileInput.click());
profileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  profileImg.src = URL.createObjectURL(file);
});

// — 저장 버튼 —
document.getElementById('saveBtn').addEventListener('click', () => {
  alert('추모공간이 수정 완료되었습니다.');
  // 여기에 실제 API 호출 로직을 넣으시면 됩니다.
});
