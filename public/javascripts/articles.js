$(document).ready(function() {
    pagInation()
    $(".delete").click(function() {
        Confirm.open({
            title: '',
            message: 'آیا از حذف مقاله اطمینان دارید؟',
            onok: () => {
                const id = $(this).attr("articleId")
                $.ajax({
                    type: "DELETE",
                    url: `/article/${id}`,
                    success: function() {
                        $('.toast').css("background-color", "green").toast({ delay: 1000 });
                        $('.toast').toast('show')
                        $('.toast-header strong').html("عملیات موفقیت آمیز")
                        $(".toast-body").html("با موفقیت حذف شد")
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
    })
})


function pagInation() {
    const url = new URL(window.location.href);
    const page = url.searchParams.get("pageno")
    if (!page)
        page = 1
    url.searchParams.set('pageno', parseInt(page) - 1)
    if (page && page != 1)
        $(".pagination").append(`<li class="page-item" id="pre">
        <a class="page-link" href=${url.href} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span></a></li>`)
    for (let index = 0; index < articlesLength / 6; index++) {
        url.searchParams.set('pageno', index + 1)
        if (page == index + 1)
            $(".pagination").append(`<li class="page-item disabled">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
        else
            $(".pagination").append(`<li class="page-item">
            <a class="page-link" href=${url.href}>${index+1}</a></li>`)
    }
    url.searchParams.set('pageno', parseInt(page) + 1)
    if (page < Math.ceil(articlesLength / 6))
        $(".pagination").append(`<li class="page-item" id="next">
        <a class="page-link" href=${url.href} aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`)
}