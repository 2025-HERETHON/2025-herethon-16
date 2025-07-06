// 1) 꽃 선택 & count 업데이트
const flowersEl   = document.getElementById('flowers');
const infoEl      = document.querySelector('.comment-info');
let selectedFlowerUrl = null;

flowersEl.addEventListener('click', e => {
  const f = e.target.closest('.flower');
  if (!f) return;
  flowersEl.querySelectorAll('.flower')
    .forEach(el => el.classList.remove('selected'));
  f.classList.add('selected');
  // background-image:url('...') → '...'
  selectedFlowerUrl = f.style.backgroundImage.slice(5, -2);
});

// 2) 댓글 등록
const sendBtn     = document.getElementById('send-btn');
const inputEl     = document.getElementById('comment-input');
const commentList = document.getElementById('comment-list');

sendBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();
  if (!text || !selectedFlowerUrl) return;
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'.');
  const card = document.createElement('div');
  card.className = 'comment-card';
  card.innerHTML = `
    <img src="${selectedFlowerUrl}" alt="꽃"/>
    <div class="comment-content">
      <div class="meta">
        <span class="name">이름없음</span>
        <span class="date">${date}</span>
      </div>
      <div class="text">${text}</div>
    </div>`;
  commentList.append(card);
  inputEl.value = '';
  const count = commentList.children.length;
  infoEl.textContent = `${count}명이 함께 꽃으로 기억을 이어가고 있습니다.`;
});
