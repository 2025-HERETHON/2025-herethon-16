// memorial-page.js
document.addEventListener('DOMContentLoaded', () => {
  // 카드 클릭 시 이동
  document.querySelectorAll('.card, .create-btn').forEach(el => {
    el.addEventListener('click', () => {
      const href = el.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });
});
