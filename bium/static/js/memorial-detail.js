document.addEventListener('DOMContentLoaded', async () => {
  // — URL에서 memorial_id 꺼내기 —
  const params     = new URLSearchParams(location.search);
  const memorialId = params.get('memorial_id');
  if (!memorialId) {
    alert('잘못된 접근입니다.');
    return;
  }

  // — 요소 참조 —
  const btnBack       = document.getElementById('btnBack');
  const coverFrame    = document.getElementById('coverFrame');
  const profileImg    = document.getElementById('profileImg');
  const memorialTitle = document.getElementById('memorialTitle');
  const memorialName  = document.getElementById('memorialName');
  const memorialDates = document.getElementById('memorialDates');
  const descSec       = document.getElementById('profileDescription');
  const openedDate    = document.getElementById('openedDate');
  const commentInfo   = document.getElementById('commentInfo');
  const flowersEl     = document.getElementById('flowers');
  const commentForm   = document.getElementById('commentForm');

  // — 폼 action 동적 설정 —
  commentForm.action = `/api/memorial/space/${memorialId}/messages/`;

  let selectedFlower = null;

  // — 뒤로가기 —
  btnBack.addEventListener('click', () => history.back());

  // — 꽃 선택 로직 —
  flowersEl.addEventListener('click', e => {
    const f = e.target.closest('.flower');
    if (!f) return;
    flowersEl.querySelectorAll('.flower').forEach(x => x.classList.remove('selected'));
    f.classList.add('selected');
    // 해당 라디오 체크
    const radio = f.querySelector('input[type=radio]');
    radio.checked = true;
  });

  // — API: 단일 추모공간 조회 —
  try {
    const res  = await fetch(`/api/memorial/space/${memorialId}/`, {
      credentials: 'include'
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error();

    const m = json.memorial;
    // 머리말 정보 채우기
    memorialName.textContent  = m.name;
    memorialTitle.textContent = `故 ${m.name} 님의 추모공간`;

    // 날짜
    const fmt = d => new Date(d).toLocaleDateString('ko-KR', {
      year:'numeric', month:'long', day:'numeric'
    });
    memorialDates.textContent = `${fmt(m.birth_date)} – ${fmt(m.death_date)}`;

    // 커버/프로필
    if (m.background_image) {
      coverFrame.style.backgroundImage =
        `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%), url(${m.background_image})`;
    }
    if (m.profile_image) {
      profileImg.src = m.profile_image;
    }

    // 소개
    descSec.innerHTML = `<p>${m.description}</p>`;

    // 개설일
    const cr = new Date(m.created_at).toLocaleDateString('ko-KR', {
      year:'numeric', month:'long', day:'numeric'
    });
    openedDate.textContent = `이 추모공간은 ${cr}에 개설되었습니다.`;
  } catch {
    alert('추모공간 정보를 불러오지 못했습니다.');
  }

  // — “수정” 버튼 클릭 시 hidden input 갱신 → submit —
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.dataset.id;
      const current = document.getElementById(`text-${id}`).textContent;
      const newMsg  = prompt('댓글을 수정하세요:', current);
      if (newMsg === null) return;

      // 숨겨둔 메시지 필드 업데이트
      document
        .getElementById(`edit-input-${id}`)
        .value = newMsg.trim();

      // 그리고 그 폼(submit button 부모) 제출
      btn.closest('form').submit();
    });
  });
});
