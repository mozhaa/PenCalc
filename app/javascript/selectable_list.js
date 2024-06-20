// current, selected

$(function() {
    $(".selectable-list").on("click", function(event) {
        let part = $(event.target).closest("li")
        if (!event.ctrlKey)
            $(this).children("li").removeClass("sl-selected")
        if (event.shiftKey) {
            part.addClass("sl-temporary")
            activate = false
            $(this).children("li").each((_, elem) => {
                if ($(elem).hasClass("sl-temporary") || $(elem).hasClass("sl-current")) {
                    if ($(elem).hasClass("sl-temporary") && $(elem).hasClass("sl-current")) {
                        $(elem).addClass("sl-selected")
                    } else {
                        activate = !activate
                        if (!activate)
                            $(elem).addClass("sl-selected")
                    }
                }
                if (activate)
                    $(elem).addClass("sl-selected")
            })
            part.removeClass("sl-temporary")
        } else {
            $(this).children("li").removeClass("sl-current")
            part.toggleClass("sl-selected")
        }   
        if (!(event.shiftKey && !event.ctrlKey))
            part.addClass("sl-current")
    })
})