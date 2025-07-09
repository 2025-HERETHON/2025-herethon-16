window.onload = function () {
  document.getElementById("BackBtn").addEventListener("click", function () {
    window.location.href = "/users/login/";
  });

  document.getElementById("SignupForm").addEventListener("submit", function () {
    console.log("회원가입 완료!");
  });
};
