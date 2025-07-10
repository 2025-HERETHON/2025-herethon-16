document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('memorialForm');
  const titleEl     = document.getElementById('topbarTitle');
  const nameInput   = document.getElementById('memorialName');
  const birthInput  = document.getElementById('birthDate');
  const deathInput  = document.getElementById('deathDate');
  const descInput   = document.getElementById('description');

  const coverFrame   = document.getElementById('coverFrame');
  const coverInput   = document.getElementById('coverInput');
  const profileFrame = document.getElementById('profileFrame');
  const profileImg   = document.getElementById('profileImg');
  const profileBtn   = document.getElementById('profileUploadBtn');
  const profileInput = document.getElementById('profileInput');

  // 뒤로가기
  document.querySelector('.btn-back')
    .addEventListener('click', () => window.history.back());

  // 1) 조회 API
  fetch('/api/memorial/space_my/', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(json => {
      if (json.success && json.memorials.length) {
        const d = json.memorials[0];
        // Topbar 이름
        titleEl.textContent = `${d.name} 님의 추모공간`;
        // 필드 채우기
        nameInput.value   = d.name;
        birthInput.value  = d.birth_date;
        deathInput.value  = d.death_date;
        descInput.value   = d.description;
        // 이미지 반영
        if (d.profile_image) profileImg.src = d.profile_image;
        if (d.background_image) {
          coverFrame.style.background =
            `linear-gradient(180deg, rgba(255,255,255,0)0%, rgba(255,255,255,1)80%), `+
            `url(${d.background_image}) center/cover no-repeat`;
        }
      }
    })
    .catch(e => console.error('조회 오류:', e));

  // 2) 배경 업로드
  coverFrame.addEventListener('click', () => coverInput.click());
  coverInput.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    coverFrame.style.background =
      `linear-gradient(180deg, rgba(255,255,255,0)0%,rgba(255,255,255,1)80%), `+
      `url(${url}) center/cover no-repeat`;
  });

  // 3) 프로필 업로드
  profileBtn.addEventListener('click', () => profileInput.click());
  profileInput.addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    profileImg.src = URL.createObjectURL(f);
  });

  // 4) 폼 제출
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    fetch(form.action, {
      method: form.method,
      credentials: 'include',
      body: data
    })
    .then(r => r.json().then(json => ({ status: r.status, json })))
    .then(({ status, json }) => {
      if (status === 201 && json.success) {
        window.location.href = 'mymemorial.html';
      } else {
        alert(json.message || '저장 중 오류가 발생했습니다.');
      }
    })
    .catch(err => {
      console.error('저장 오류:', err);
      alert('서버 통신 중 오류가 발생했습니다.');
    });
  });
});
