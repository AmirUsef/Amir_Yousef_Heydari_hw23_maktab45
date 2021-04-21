function checkform() {
    if (!(/\.(jpg|jpeg|png)$/).test($("input[type='file']").val())) {
        $('.toast').toast({ delay: 5000 });
        $('.toast').toast('show')
        $(".toast-body").html("فرمت عکس نادرست است")
        return false
    }
}
$(document).ready(function() {
    const userId = window.localStorage.getItem('userId')
    $("input[type='file']").change(function() {
        $("form").submit();
    })
    $(".modal .close").click(function() {
        $('#myModal').modal('hide')
    });
    $("#firstName a").click(function() {
        $('#myModal').modal('show')
        $('.modal-header h2').html("ویرایش نام")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:نام جدید </label><input></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^[a-zA-Z\s]*$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("نام معتبر نیست")

            $.ajax({
                type: "PUT",
                url: `/user/${userId}`,
                data: { firstName: $(".modal-body input").val() },
                success: function(result) {
                    location.reload();
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            });
        })
    })
    $("#lastName a").click(function() {
        $('#myModal').modal('show')
        $('.modal-header h2').html("ویرایش نام خانوادگی")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:نام خانوادگی جدید </label><input></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^[a-zA-Z\s]*$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("نام معتبر نیست")

            $.ajax({
                type: "PUT",
                url: `/user/${userId}`,
                data: { lastName: $(".modal-body input").val() },
                success: function(result) {
                    location.reload();
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            });
        })
    })
    $("#phoneNumber a").click(function() {
        $('#myModal').modal('show')
        $('.modal-header h2').html("ویرایش شماره همراه")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:شماره جدید </label><input type="tel" placeholder="09121111111" maxlength="11"><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            if ($(".modal-body input").val() == "")
                return $(".modal-body p").html("الزامی")
            else if (!(/^09[0-9]{9}$/).test($(".modal-body input").val()))
                return $(".modal-body p").html("تلفن همراه معتبر نیست")

            $.ajax({
                type: "PUT",
                url: `/user/${userId}`,
                data: { phoneNumber: $(".modal-body input").val() },
                success: function(result) {
                    location.reload();
                },
                error: function(error) {
                    if (error.status == 409)
                        $(".modal-body p").html("اکانتی با این شماره وجود دارد")
                    else {
                        $('.toast').toast({ delay: 5000 });
                        $('.toast').toast('show')
                        $(".toast-body").html("خطای سرور")
                    }
                }
            });
        })
    })
    $("#gender a").click(function() {
        $('#myModal').modal('show')
        $('.modal-header h2').html("ویرایش جنسیت")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:جنسیت </label><select><option value="male">Male</option><option value="female">Female</option></select><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            $.ajax({
                type: "PUT",
                url: `/user/${userId}`,
                data: { gender: $(".modal-body select").val() },
                success: function(result) {
                    location.reload();
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            });
        })
    })
    $("#password a").click(function() {
        $('#myModal').modal('show')
        $('.modal-header h2').html("ویرایش پسوورد")
        $(".modal-body").html(`<span class="d-flex flex-row-reverse"><label>:پسوورد فعلی</label><input type="password"></input><p></p></span>
                                <span class="d-flex flex-row-reverse"><label>:پسوورد جدید</label><input type="password"></input><p></p></span>
                                <span class="d-flex flex-row-reverse"><label>:تایید پسوورد </label><input type="password"></input><p></p></span>`)
        $('.modal-footer').html(`<button class="btn saveBtn">ثبت</button>`)
        $(".saveBtn").click(function() {
            const password = $(".modal-body input:eq(0)").val()
            const newpassword = $(".modal-body input:eq(1)").val()
            const confirmpass = $(".modal-body input:eq(2)").val()
            if (!password)
                return $(".modal-body p:eq(0)").html("الزامی")
            else
                $(".modal-body p:eq(0)").html("")
            if (!newpassword)
                return $(".modal-body p:eq(1)").html("الزامی")
            else if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).test(newpassword))
                return $(".modal-body p:eq(1)").html("پسوورد باید حداقل 8 کاراکتر شامل حداقل 1 حرف و 1 عدد باشد")
            else if (password == newpassword)
                return $(".modal-body p:eq(1)").html("پسوورد جدید و قدیم یکسان هستند")
            else
                $(".modal-body p:eq(1)").html("")
            if (newpassword != confirmpass)
                return $(".modal-body p:eq(2)").html("پسوورد های وارد شده یکسان نیست")
            else
                $(".modal-body p:eq(2)").html("")
            $.ajax({
                type: "PUT",
                url: `/user/${userId}`,
                data: { password, newpassword },
                success: function(result) {
                    window.location.href = 'http://localhost:3000/auth/login'
                },
                error: function(error) {
                    if (error.status == 404)
                        $(".modal-body p:eq(0)").html("پسوورد وارد شده اشتباه است")
                    else {
                        $('.toast').toast({ delay: 5000 });
                        $('.toast').toast('show')
                        $(".toast-body").html("خطای سرور")
                    }
                }
            });
        })
    })
})