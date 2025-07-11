window.onload = function () {
  document.getElementById("GoHomeBtn").addEventListener("click", function () {
    window.location.href = "/";
  });

  let DownloadBtn = document.getElementById("DownloadBtn");
  let toast = document.getElementById("toast_box");

  function toastOn() {
    toast.classList.add("active");
    setTimeout(function () {
      toast.classList.remove("active");
    }, 2000);
  }

  DownloadBtn.addEventListener("click", function () {
    console.log("토스트 성공");
    toastOn();
  });
};