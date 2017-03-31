$(document).ready(function () {
  $(".login_form").submit(function (e) {

    $.ajax({
      type: "POST",
      url: "/login",
      data: $(".login_form").serialize(),
      success: function (data) {
        return location.go('/');
      },
      error: function(data) {
        alert(data);
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
        window.location.replace = '/';
      },
      error: function(data) {
        alert(data);
      }
    });

    e.preventDefault();
  });
})
