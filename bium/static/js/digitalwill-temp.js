document.addEventListener("DOMContentLoaded", () => {
  // ✅ 서버 템플릿에서 이미 완료 단계 숫자를 삽입했으므로 JS에서 다시 처리할 필요 없음

  // 뒤로가기 버튼 처리
  document.querySelector(".btn-back")?.addEventListener("click", () => {
    history.back(); // 또는 location.href = "main-page.html";
  });
});
