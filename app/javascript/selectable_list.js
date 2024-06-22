$(document).on("turbo:load", function() {
    $(".selectable-list").on("click", function(event) {
        let part = $(event.target).closest("li")
        if (!event.ctrlKey)
            $(this).children("li").removeClass("sl-selected")
        if (event.shiftKey) {
            if ($(this).children("li.sl-current").length == 0) {
                $(this).children("li").removeClass("sl-current")
                part.addClass("sl-current sl-selected")
            } else {
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
            }
        } else {
            part.toggleClass("sl-selected")
        }   
        if (!(event.shiftKey && !event.ctrlKey)) {
            $(this).children("li").removeClass("sl-current")
            part.addClass("sl-current")
        }

        var selected_ids = []
        $(".selectable-list > li.sl-selected").each((i, elem) => {
            selected_ids.push($(elem).data("id"))
        })
        window.canvas_handler.bindSelectionFromList(selected_ids)
    })
})

function removeSelection() {
    $(".selectable-list > li").removeClass("sl-selected")
}

function select(selected_ids) {
    selected_ids.forEach((id) => {
        $(`.selectable-list > li[data-id=${id}]`).addClass("sl-selected")
    })
}