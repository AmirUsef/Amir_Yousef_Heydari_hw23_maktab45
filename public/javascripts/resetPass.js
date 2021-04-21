$(document).ready(function() {
    $("#submit").click(function() {
        const username = $("#input1").val();
        username ? $("#error1").html("") : $("#error1").html("الزامی")
        if (username) {
            $.ajax({
                type: "POST",
                url: "/auth/resetPass",
                data: { username: $("#input1").val().trim() },
                success: function(result) {
                    $('.toast').css("background-color", "green").toast({ delay: 3000 });
                    $('.toast').toast('show')
                    $('.toast-header strong').html("عملیات موفقیت آمیز")
                    $(".toast-body").html("رمز عبور جدید به شماره همراه شما ارسال شد")
                    setTimeout(function() { window.location.href = `http://localhost:3000/auth/login` }, 3000);
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    if (error.status == 404)
                        $(".toast-body").html("اکانت یافت نشد")
                    if (error.status == 500)
                        $(".toast-body").html("خطای سرور")
                }
            });
        }
    })
})