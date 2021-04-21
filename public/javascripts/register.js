$(document).ready(function() {
    $("#submit").click(function() {
        if (validateInputs()) {
            const user = {
                firstName: $("#input1").val().trim(),
                lastName: $("#input2").val().trim(),
                username: $("#input3").val().trim(),
                phoneNumber: $("#input4").val(),
                gender: $("#input5").val(),
                password: $("#input6").val()
            }
            $.ajax({
                type: "POST",
                url: "/auth/register",
                data: user,
                success: function() {
                    window.location.href = 'http://localhost:3000/auth/login'
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    if (error.status == 409)
                        $(".toast-body").html("اکانت با این مشخصات وجود دارد")
                    if (error.status == 500)
                        $(".toast-body").html("خطای سرور")
                }
            });
        }
    })
})

function validateInputs() {
    const firstName = $("#input1").val();
    const lastName = $("#input2").val();
    const username = $("#input3").val();
    const phoneNumber = $("#input4").val();
    const pass1 = $("#input6").val();
    const pass2 = $("#input7").val();
    if (firstName == "")
        $("#error1").html("الزامی")
    else if (!(/^[a-zA-Z\s]*$/).test(firstName) || firstName.length < 3 || firstName.length > 15)
        $("#error1").html("نام معتبر نیست")
    else
        $("#error1").html("")
    if (lastName == "")
        $("#error2").html("الزامی")
    else if (!(/^[a-zA-Z\s]*$/).test(lastName) || lastName.length < 3 || lastName.length > 15)
        $("#error2").html("نام معتبر نیست")
    else
        $("#error2").html("")
    if (username == "")
        $("#error3").html("الزامی")
    else if (!(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).test(username))
        $("#error3").html("نام کاربری معتبر نیست")
    else
        $("#error3").html("")
    if (phoneNumber == "")
        $("#error4").html("الزامی")
    else if (!(/^09[0-9]{9}$/).test(phoneNumber))
        $("#error4").html("تلفن همراه معتبر نیست")
    else
        $("#error4").html("")
    if (pass1 == "")
        $("#error6").html("الزامی")
    else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(pass1))
        $("#error6").html("پسوورد باید حداقل 8 کاراکتر شامل حداقل 1 حرف و 1 عدد باشد")
    else
        $("#error6").html("")

    if (pass2 == "")
        $("#error7").html("الزامی")
    else if (pass1 != pass2)
        $("#error7").html("پسوورد های وارد شده یکسان نیست")
    else
        $("#error7").html("")

    return ($("#error1").html() == "" && $("#error2").html() == "" && $("#error3").html() == "" && $("#error4").html() == "" && $("#error6").html() == "" && $("#error7").html() == "")
}