window.onload = function () {
  const modal = document.querySelector(".modal");
  const cancelBtn = document.getElementById("CancelBtn");
  const modalDelete = document.querySelector(".modal-delete");
  const modalSave = document.querySelector(".modal-button .modal-text");

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  // 모달 닫기 (삭제하기)
  modalDelete.addEventListener("click", function () {
    modal.style.display = "none";
    window.location.href = "/";
  });

  // 모달 닫기 (임시저장하기)
  modalSave.addEventListener("click", function () {
    modal.style.display = "none";
    document.getElementById("step01Form").submit();
  });
};
