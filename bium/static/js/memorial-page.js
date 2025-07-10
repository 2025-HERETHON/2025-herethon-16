// memorial-page.js
document.addEventListener('DOMContentLoaded', async () => {
  // 사이드바 & 검색 로직 (기존 그대로)
  const openBtn   = document.getElementById('openSidebar');
  const closeBtn  = document.getElementById('closeSidebar');
  const sidebar   = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');
  const searchBtn = document.getElementById('searchBtn');

  openBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    mainFrame.classList.add('blurred');
  });
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    mainFrame.classList.remove('blurred');
  });
  document.querySelectorAll('.sidebar-menu a').forEach(a => {
    a.addEventListener('click', () => {
      sidebar.classList.remove('open');
      mainFrame.classList.remove('blurred');
    });
  });
  searchBtn.addEventListener('click', () => {
    window.location.href = 'memorial-search.html';
  });

  // 요소 참조
  const myCard       = document.querySelector('.card.my-space');
  const myPic        = myCard.querySelector('.profile-pic');
  const myName       = myCard.querySelector('.name');
  const myDesc       = myCard.querySelector('.desc');
  const createBtn    = document.querySelector('.create-btn');
  const othersList   = document.querySelector('.others-list');

  // 1) 나의 추모공간 불러오기
  let myId = null;
  try {
    const res = await fetch('/api/memorial/space_my/', {
      method: 'GET',
      credentials: 'include'
    });
    const json = await res.json();
    if (res.ok && json.success && json.memorials.length > 0) {
      const m = json.memorials[0];
      myId = m.id;

      // 내 카드 업데이트
      myName.textContent = m.name;
      myDesc.textContent = m.description;
      if (m.profile_image) {
        myPic.src = m.profile_image;
      }
      if (m.background_image) {
        myCard.style.background =
          `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%),` +
          ` url(${m.background_image}) center/cover no-repeat`;
      }
    }
    // else: 아직 생성 전 → 기본 카드 유지
  } catch (e) {
    console.error('내 공간 조회 오류:', e);
  }

  // 클릭: 내 공간 → 수정 페이지
  myCard.addEventListener('click', () => {
    window.location.href = myId
      ? 'mymemorial.html'
      : 'memorial-edit.html';
  });

  // 클릭: 새 공간 만들기
  createBtn.addEventListener('click', () => {
    window.location.href = 'memorial-edit.html';
  });

  // 2) 다른 이들의 추모공간 불러오기
  try {
    const res2 = await fetch('/api/memorial/space/', {
      method: 'GET',
      credentials: 'include'
    });
    const j2   = await res2.json();
    if (res2.ok && j2.success) {
      // 초기화
      othersList.innerHTML = '';
      j2.memorials.forEach(m => {
        if (m.id === myId) return; // 나의 공간 제외

        // 카드 엘리먼트 생성
        const card = document.createElement('div');
        card.className = 'card other-card';
        card.addEventListener('click', () => {
          window.location.href = `memorial-detail.html?id=${m.id}`;
        });
        // innerHTML 채우기
        card.innerHTML = `
          <img class="avatar"
               src="${m.profile_image||'../static/images/assets/profile.jpg'}"
               alt="프로필"/>
          <div class="info">
            <h3 class="name">${m.name}</h3>
            <p class="desc">${m.description}</p>
            <p class="dates">
              ${formatDate(m.birth_date)} – ${formatDate(m.death_date)}
            </p>
          </div>
        `;
        othersList.append(card);
      });
    }
  } catch (e) {
    console.error('목록 조회 오류:', e);
  }

  // 헬퍼: YYYY-MM-DD → "YYYY년 M월 D일"
  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
  }

  // 3) 페이지 강조 (사이드바)
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-section').forEach(sec => {
    const hrefs = Array.from(sec.querySelectorAll('a'))
      .map(a => a.href.split('/').pop());
    if (hrefs.includes(current)) sec.classList.add('active');
    else                       sec.classList.remove('active');
  });
});
