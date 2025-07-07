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
  coverFrame.style.backgroundImage = `url(${URL.createObjectURL(f)})`;
});

// 프로필 업로드
const profileFrame = document.getElementById('profileFrame');
const profileInput = document.getElementById('profileInput');
const profileImg   = document.getElementById('profileImg');
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
