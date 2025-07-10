// memorial-page.js
document.addEventListener('DOMContentLoaded', async () => {
  // 사이드바 토글
  const openBtn   = document.getElementById('openSidebar');
  const closeBtn  = document.getElementById('closeSidebar');
  const sidebar   = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');
  openBtn.addEventListener('click', ()=>{
    sidebar.classList.add('open');
    mainFrame.classList.add('blurred');
  });
  closeBtn.addEventListener('click', ()=>{
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });
  document.querySelectorAll('.sidebar-menu a').forEach(a=>{
    a.addEventListener('click', ()=>{
      sidebar.classList.remove('open');
      mainFrame.classList.remove('blurred');
    });
  });

  // 검색 아이콘
  document.getElementById('searchBtn')
    .addEventListener('click', ()=> window.location.href = 'memorial-search.html');

  // 내 공간 카드 & 새 공간 만들기 폼
  const mySpaceForm = document.getElementById('mySpaceForm');
  const createForm  = document.getElementById('createForm');
  let myId = null;

  // 1) 내 공간 조회 → 카드 내용 채우기, 폼 action 동적 설정
  try {
    const res  = await fetch('/api/memorial/space_my/', { credentials: 'include' });
    const json = await res.json();
    if (res.ok && json.success && json.memorials.length > 0) {
      const m = json.memorials[0];
      myId = m.id;
      // 카드 내용
      mySpaceForm.querySelector('.name').textContent = m.name;
      mySpaceForm.querySelector('.desc').textContent = m.description;
      if (m.profile_image) {
        mySpaceForm.querySelector('.profile-pic').src = m.profile_image;
      }
      if (m.background_image) {
        mySpaceForm.style.background =
          `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), `+
          `url(${m.background_image}) center/cover no-repeat`;
      }
      // 클릭 시 내 공간 보기 페이지로
      mySpaceForm.action = `mymemorial.html?memorial_id=${m.id}`;
    } else {
      // 아직 생성 전 → 기본 action 유지 (memorial-edit 으로)
      mySpaceForm.action = 'memorial-edit.html';
    }
  } catch (e) {
    console.error('내 공간 조회 오류:', e);
  }

  // 2) 다른 이들의 추모공간 조회 → 동적 렌더링
  const othersList = document.querySelector('.others-list');
  try {
    const res2 = await fetch('/api/memorial/space/', { credentials: 'include' });
    const j2   = await res2.json();
    if (res2.ok && j2.success) {
      const others = j2.memorials.filter(m => m.id !== myId);
      if (others.length === 0) {
        othersList.innerHTML = '<p class="empty-msg">등록된 공간이 없습니다.</p>';
      } else {
        othersList.innerHTML = '';
        others.forEach(m => {
          const form = document.createElement('form');
          form.method = 'get';
          form.action = `memorial-detail.html?memorial_id=${m.id}`;
          form.className = 'card other-card';
          form.innerHTML = `
            <img class="avatar"
                 src="${m.profile_image || '../static/images/assets/profile.jpg'}"
                 alt="프로필"/>
            <div class="info">
              <h3 class="name">${m.name}</h3>
              <p class="desc">${m.description}</p>
              <p class="dates">${formatDate(m.birth_date)} – ${formatDate(m.death_date)}</p>
            </div>
          `;
          othersList.append(form);
        });
      }
    } else {
      othersList.innerHTML = '<p class="empty-msg">공간을 불러오지 못했습니다.</p>';
    }
  } catch (e) {
    console.error('다른 공간 조회 오류:', e);
    othersList.innerHTML = '<p class="empty-msg">공간을 불러오지 못했습니다.</p>';
  }

  // 날짜 포맷 헬퍼
  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  }

  // 3) 사이드바 current 강조
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-section').forEach(sec => {
    const hrefs = Array.from(sec.querySelectorAll('a'))
                       .map(a => a.href.split('/').pop());
    sec.classList.toggle('active', hrefs.includes(current));
  });
});
