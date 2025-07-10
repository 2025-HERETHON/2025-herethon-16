// ../static/js/mymemorial-edit.js
document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('memorialForm');
  const titleEl     = document.getElementById('topbarTitle');
  const nameInput   = document.getElementById('memorialName');
  const birthInput  = document.getElementById('birthDate');
  const deathInput  = document.getElementById('deathDate');
  const descTextarea= document.getElementById('description');

  const coverFrame   = document.getElementById('coverFrame');
  const coverInput   = document.getElementById('coverInput');
  const profileBtn   = document.getElementById('profileUploadBtn');
  const profileInput = document.getElementById('profileInput');
  const profileImg   = document.getElementById('profileImg');

  // 뒤로가기
  document.querySelector('.btn-back')
    .addEventListener('click', () => window.history.back());

  // 1) 조회 API → 폼 필드, 타이틀 세팅
  fetch('/api/memorial/space_my/', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(json => {
      if (json.success && json.memorials.length) {
        const d = json.memorials[0];
        titleEl.textContent = `${d.name} 님의 추모공간`;
        nameInput.value    = d.name;
        birthInput.value   = d.birth_date;
        deathInput.value   = d.death_date;
        descTextarea.value = d.description;
        if (d.profile_image) {
          profileImg.src = d.profile_image;
        }
        if (d.background_image) {
          coverFrame.style.background =
            `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%),` +
            ` url(${d.background_image}) center/cover no-repeat`;
        }
      }
    })
    .catch(e => console.error('조회 오류:', e));

  // 2) 배경 업로드 → 미리보기
  coverFrame.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    coverFrame.style.background =
      `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%),` +
      ` url(${url}) center/cover no-repeat`;
  });

  // 3) 프로필 업로드 → 미리보기
  profileBtn.addEventListener('click', () => profileInput.click());
  profileInput.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    profileImg.src = URL.createObjectURL(f);
  });

  // 4) **폼 제출 핸들러 제거** → 브라우저 기본 submit & 리다이렉트
  // form.addEventListener('submit', …) 블록 삭제
});
