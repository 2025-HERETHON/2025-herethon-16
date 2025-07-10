const modal = document.querySelector(".modal");
const cancelBtn = document.getElementById("CancelBtn");
const modalDelete = document.querySelector(".modal-delete");
const modalSave = document.querySelector(".modal-button .modal-text");

window.onload = function () {
  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "/will/step04/";
  });

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(cancelBtn, modal);
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
    document.getElementById("step05Form").submit();
  });
};
