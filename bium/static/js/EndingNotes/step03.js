window.onload = function () {
  document.getElementById("CancelBtn").addEventListener("click", function () {
    window.location.href = "login.html";
  });

  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "step02.html";
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    window.location.href = "step04.html";
  });
};
