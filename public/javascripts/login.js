$(document).ready(function() {
    $("#submit").click(function() {
        if (validateInputs()) {
            $.ajax({
                type: "POST",
                url: "/auth/login",
                data: { username: $("#input1").val().trim(), password: $("#input2").val().trim() },
                success: function(result) {
                    window.location.href = `http://localhost:3000/user/dashboard`
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

function validateInputs() {
    const username = $("#input1").val();
    const password = $("#input2").val();
    username ? $("#error1").html("") : $("#error1").html("الزامی")
    password ? $("#error2").html("") : $("#error2").html("الزامی")
    return (username && password)
}

var a = [{}, {}]
a.forEach(i => i.name = "kcwc")
console.log(a);