$(document).ready(function() {
    $(".sidebar-header h3").html(window.localStorage.getItem('username'))
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });
    if (window.localStorage.getItem('role') === 'blogger') {
        $(".first").html(`<li><a href="/user/addArticle">افزودن مقاله جدید</a></li><li><a href="/article/articles/${window.localStorage.getItem('userId')}" class="myArticles">مقالات من</a></li>`)
        $(".last").html(`<li><a class="deleteBtn">حذف اکانت</a></li>`)
        $(".deleteBtn").click(function() {
            Confirm.open({
                title: '',
                message: 'آیا از حذف حساب کاربری خود اطمینان دارید؟',
                onok: () => {
                    $.ajax({
                        type: "DELETE",
                        url: `/user/${window.localStorage.getItem('userId')}`,
                        success: function() {
                            $('.toast').css("background-color", "green").toast({ delay: 3000 });
                            $('.toast').toast('show')
                            $('.toast-header strong').html("عملیات موفقیت آمیز")
                            $(".toast-body").html("اکانت با موفقیت حذف شد")
                            setTimeout(function() { window.location.href = `http://localhost:3000` }, 3000);
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
    } else {
        $(".first").html(`<li><a href="/user/AllUsers">کاربران</a></li>`)
        $(".delete").css("background-color", "red")
        $(".reset").css("background-color", "green")
        $(".delete").click(function() {
            const id = $(this).attr("userId")
            $.ajax({
                type: "DELETE",
                url: `/user/${id}`,
                success: function() {
                    $('.toast').css("background-color", "green").toast({ delay: 1000 });
                    $('.toast').toast('show')
                    $('.toast-header strong').html("عملیات موفقیت آمیز")
                    $(".toast-body").html("با موفقیت انجام شد")
                    setTimeout(function() { location.reload(); }, 1000);
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        })
        $(".reset").click(function() {
            const username = $(this).attr("username")
            $.ajax({
                type: "POST",
                url: `/auth/resetPass`,
                data: { username },
                success: function() {
                    $('.toast').css("background-color", "green").toast({ delay: 1000 });
                    $('.toast').toast('show')
                    $('.toast-header strong').html("عملیات موفقیت آمیز")
                    $(".toast-body").html("با موفقیت انجام شد")
                    setTimeout(function() { location.reload(); }, 1000);
                },
                error: function(error) {
                    $('.toast').toast({ delay: 5000 });
                    $('.toast').toast('show')
                    $(".toast-body").html("خطای سرور")
                }
            })
        })
    }

})

const Confirm = {
    open(options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            okText: 'بله',
            cancelText: 'خیر',
            onok: function() {},
            oncancel: function() {}
        }, options);

        const html = `
            <div class="confirm">
                <div class="confirm__window">
                    <div class="confirm__titlebar">
                        <span class="confirm__title">${options.title}</span>
                        <button class="confirm__close">&times;</button>
                    </div>
                    <div class="confirm__content">${options.message}</div>
                    <div class="confirm__buttons">
                        <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                        <button class="confirm__button confirm__button--cancel">${options.cancelText}</button>
                    </div>
                </div>
            </div>
        `;

        const template = document.createElement('template');
        template.innerHTML = html;

        // Elements
        const confirmEl = template.content.querySelector('.confirm');
        const btnClose = template.content.querySelector('.confirm__close');
        const btnOk = template.content.querySelector('.confirm__button--ok');
        const btnCancel = template.content.querySelector('.confirm__button--cancel');

        confirmEl.addEventListener('click', e => {
            if (e.target === confirmEl) {
                options.oncancel();
                this._close(confirmEl);
            }
        });

        btnOk.addEventListener('click', () => {
            options.onok();
            this._close(confirmEl);
        });

        [btnCancel, btnClose].forEach(el => {
            el.addEventListener('click', () => {
                options.oncancel();
                this._close(confirmEl);
            });
        });

        document.body.appendChild(template.content);
    },

    _close(confirmEl) {
        confirmEl.classList.add('confirm--close');

        confirmEl.addEventListener('animationend', () => {
            document.body.removeChild(confirmEl);
        });
    }
};