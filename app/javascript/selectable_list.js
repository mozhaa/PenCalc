// current, selected

$(function() {
    $(".selectable-list").on("click", function(event) {
        let part = $(event.target).closest("li")
        if (event.ctrlKey) {
            console.log(`ctrl + click, target: ${part.data("id")}`)
            $(this).children("li").removeClass("sl-current")
            part.toggleClass("sl-selected")
        } else {
            console.log(`click, target: ${part.data("id")}`)
            $(this).children("li").removeClass("sl-selected sl-current")
            part.addClass("sl-selected")
        }
        part.addClass("sl-current")
        // if ($(this).hasClass("sl-selected"))
    })
})