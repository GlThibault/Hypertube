$(document).ready(function () {
  $(".login_form").submit(function (e) {

    $.ajax({
      type: "POST",
      url: "/login",
      data: $(".login_form").serialize(),
      success: function (data) {
        window.location.href = '/';
      },
      error: function(data) {
        alert(data.responseText);
      }
    });

    e.preventDefault();
  });
  $(".register_form").submit(function (e) {

    $.ajax({
      type: "POST",
      url: "/register",
      data: $(".register_form").serialize(),
      success: function () {
        window.location.href = '/login';
      },
      error: function(data) {
        alert(data.responseText);
      }
    });

    e.preventDefault();
  });
})
