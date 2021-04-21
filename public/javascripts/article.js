$(document).ready(function() {
    $("#commentImage").attr("src", `/images/avatars/${window.localStorage.getItem('avatar')}`)
    $(".send").click(function() {
        const text = $("textarea").val()
        if (text.length < 3) {
            $('.toast').toast({ delay: 5000 });
            $('.toast').toast('show')
            $(".toast-body").html("کامنت بسیار کوتاه است")
            return false
        } else if (text.length > 100) {
            $('.toast').toast({ delay: 5000 });
            $('.toast').toast('show')
            $(".toast-body").html("کامنت بسیار بزرگ است")
            return false
        } else {
            const article = $(this).attr("articleId")
            $.ajax({
                type: "POST",
                url: `/comment`,
                data: { text, article },
                success: function() {
                    $('.toast').css("background-color", "green").toast({ delay: 1000 });
                    $('.toast').toast('show')
                    $('.toast-header strong').html("عملیات موفقیت آمیز")
                    $(".toast-body").html("با موفقیت ارسال شد")
                    setTimeout(function() { location.reload(); }, 1000);
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        }
    })
    $(".deleteComment").click(function() {
        const id = $(this).attr("commentId")
        $.ajax({
            type: "DELETE",
            url: `/comment/${id}`,
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