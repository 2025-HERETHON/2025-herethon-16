window.onload = function () {
  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "/will/step04/";
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    window.location.href = "/will/step06/";
  });

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
  });

  // 모달 닫기 (삭제하기)
  modalDelete.addEventListener("click", function () {
    modal.style.display = "none";
    window.location.href = "/main-page/";
  });

  // 모달 닫기 (임시저장하기)
  modalSave.addEventListener("click", function () {
    modal.style.display = "none";

    save(true)
      .then((Response) => Response.json())
      .then((data) => console.log("임시저장 성공"))
      .catch((error) => console.error("임시저장 Error", error));
  });
};
