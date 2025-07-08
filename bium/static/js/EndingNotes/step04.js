window.onload = function () {
  document.getElementById("CancelBtn").addEventListener("click", function () {
    window.location.href = "login.html";
  });

  document.getElementById("BeforeBtn").addEventListener("click", function () {
    window.location.href = "step03.html";
  });

  document.getElementById("NextBtn").addEventListener("click", function () {
    window.location.href = "step05.html";
  });
};
