function checkform() {
    if ($("form input").val().length < 3 || $("form input").val().length > 30) {
        $("span p").html("عنوان مقاله باید بین 3 تا 30 کاراکتر باشد").css("color", "red")
        return false
    }
    if ($("form textarea").val().length < 20) {
        $('.toast').toast({ delay: 5000 });
        $('.toast').toast('show')
        $(".toast-body").html("مقاله بسیار کوتاه است")
        return false
    }
    if ($("form textarea").val().length > 4000) {
        $('.toast').toast({ delay: 5000 });
        $('.toast').toast('show')
        $(".toast-body").html("مقاله بسیار بزرگ است")
        return false
    }
}
$(document).ready(function() {
    $('#summernote').summernote({
        height: 590,
        focus: true,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['ltr', 'rtl']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        callbacks: {
            onImageUpload: function(files) {
                for (let index = 0; index < files.length; index++)
                    saveFile(files[index]);
            }
        }
    })
    $(".note-editor").width("100%")

    function saveFile(file) {
        data = new FormData();
        data.append("file", file);
        $.ajax({
            data: data,
            type: "POST",
            url: "/article/image",
            cache: false,
            contentType: false,
            processData: false,
            success: function(url) {
                $("#summernote").summernote("insertImage", url);
            },
            error: function(error) {
                $('.toast').toast({ delay: 5000 });
                $('.toast').toast('show')
                error.status == 400 ? $(".toast-body").html("فرمت عکس نادرست است") : $(".toast-body").html("خطای سرور")
            }
        })
    }
})