window.onload = function () {
  const modal = document.querySelector(".modal");
  const cancelBtn = document.getElementById("CancelBtn");
  const modalDelete = document.querySelector(".modal-delete");
  const modalSave = document.querySelector(".modal-button .modal-text");

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    // window.location.href = "login.html";
  });

  // 모달 닫기 (삭제하기)
  modalDelete.addEventListener("click", function () {
    modal.style.display = "none";
    // 여기서 내용 삭제 로직 추가 예정
    window.location.href = "login.html";
  });

  // 모달 닫기 (임시저장하기)
  modalSave.addEventListener("click", function () {
    modal.style.display = "none";
    // 여기서 임시저장 로직 추가 예정
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    window.location.href = "step02.html";
  });
};
