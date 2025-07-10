document.addEventListener('DOMContentLoaded', () => {
  const coverFrame   = document.getElementById('coverFrame');
  const profileImg   = document.getElementById('profileImg');
  const titleEl      = document.getElementById('spaceTitle');
  const datesEl      = document.getElementById('datesText');
  const descEl       = document.getElementById('descText');
  const editBtn      = document.getElementById('editBtn');
  const backBtn      = document.querySelector('.btn-back');
  const agentBtn     = document.getElementById('agentBtn');
  const agentContainer = document.getElementById('agentLinkContainer');

  let memorialId = null;

  // 뒤로가기
  backBtn.addEventListener('click', () => window.history.back());

  // 수정 페이지로 이동
  editBtn.addEventListener('click', () => {
    window.location.href = 'mymemorial-edit.html';
  });

  // 1) 내 추모공간 조회
  fetch('/api/memorial/space_my/', {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(json => {
      if (json.success && json.memorials.length > 0) {
        const d = json.memorials[0];
        memorialId = d.id;

        // 제목
        titleEl.textContent = `${d.name} 님의 추모공간`;

        // 날짜 포맷
        const bd = new Date(d.birth_date);
        const dd = new Date(d.death_date);
        datesEl.textContent =
          `${bd.getFullYear()}년 ${bd.getMonth()+1}월 ${bd.getDate()}일 – ` +
          `${dd.getFullYear()}년 ${dd.getMonth()+1}월 ${dd.getDate()}일`;

        // 설명
        descEl.textContent = d.description;

        // 이미지 반영
        if (d.profile_image) {
          profileImg.src = d.profile_image;
        }
        if (d.background_image) {
          coverFrame.style.background =
            `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), ` +
            `url(${d.background_image}) center/cover no-repeat`;
        }
      } else {
        // 공간이 없으면 수정 페이지로
        window.location.href = 'mymemorial-edit.html';
      }
    })
    .catch(err => {
      console.error('조회 오류:', err);
      alert('로그인이 필요합니다.');
      window.location.href = 'login.html';
    });

  // 2) 대리인 링크 생성
  agentBtn.addEventListener('click', () => {
    if (!memorialId) return alert('아직 조회 중입니다.');
    fetch(`/api/memorial/space_my/${memorialId}/generate_agent_link`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => res.json().then(json => ({ status: res.status, json })))
      .then(({ status, json }) => {
        if (status === 200 && json.success) {
          agentContainer.innerHTML =
            `<a href="${json.agent_link}" target="_blank">${json.agent_link}</a>`;
        } else {
          alert(json.message || '대리인 링크 생성에 실패했습니다.');
        }
      })
      .catch(err => {
        console.error('링크 생성 오류:', err);
        alert('서버 통신 중 오류가 발생했습니다.');
      });
  });
});
