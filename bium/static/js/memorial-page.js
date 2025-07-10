// ✅ memorial-page.js
document.addEventListener('DOMContentLoaded', async () => {
  // ───────────────────────────────
  // 0) 사이드바 토글
  const openBtn   = document.getElementById('openSidebar');
  const closeBtn  = document.getElementById('closeSidebar');
  const sidebar   = document.getElementById('sidebar');
  const mainFrame = document.querySelector('.main-frame');

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

  // ───────────────────────────────
  // 1) 검색 버튼 클릭 → memorial-search 이동
  document.getElementById('searchBtn')
    .addEventListener('click', () => {
      window.location.href = 'memorial-search.html';
    });

  // ───────────────────────────────
  // 2) 내 추모공간 조회
  // ※ 서버에서 렌더링하게 될 경우 이 fetch 제거 가능
  const mySpaceForm = document.getElementById('mySpaceForm');
  try {
    const res = await fetch('/api/memorial/space_my/', {
      method: 'GET',
      credentials: 'include'
    });
    const json = await res.json();

    if (res.ok && json.success && json.memorials.length > 0) {
      const d = json.memorials[0];

      mySpaceForm.querySelector('.name').textContent = d.name;
      mySpaceForm.querySelector('.desc').textContent = d.description;
      mySpaceForm.querySelector('.profile-pic').src =
        d.profile_image || '../static/images/assets/profile.jpg';
    }
  } catch (e) {
    console.error('내 공간 조회 오류:', e);
  }

  // ───────────────────────────────
  // 3) 다른 추모공간 목록 조회
  const othersList = document.querySelector('.others-list');
  try {
    const res2 = await fetch('/api/memorial/space/', {
      credentials: 'include'
    });
    const j2 = await res2.json();

    if (res2.ok && j2.success) {
      const others = j2.memorials;

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
          othersList.appendChild(form);
        });
      }
    } else {
      othersList.innerHTML = '<p class="empty-msg">공간을 불러오지 못했습니다.</p>';
    }
  } catch (e) {
    console.error('다른 공간 조회 오류:', e);
    othersList.innerHTML = '<p class="empty-msg">공간을 불러오지 못했습니다.</p>';
  }

  // 날짜 포맷 도우미 함수
  function formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  // ───────────────────────────────
  // 4) 사이드바 내 현재 위치 강조
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-section').forEach(sec => {
    const hrefs = Array.from(sec.querySelectorAll('a'))
      .map(a => a.href.split('/').pop());
    sec.classList.toggle('active', hrefs.includes(current));
  });
});
