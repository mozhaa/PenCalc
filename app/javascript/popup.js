function show(elem) {
    elem.removeClass("display-none")
    elem.addClass("display-block")
}

function hide(elem) {
    elem.removeClass("display-block")
    elem.addClass("display-none")
}

class Popup {
    constructor() {
        $("body").append('<div class="popup-container" id="popup-container"></div>')
        this.container = $("#popup-container")
        this.pages_counter = 0
    }

    show() {
        show(this.container)
    }
    
    hide() {
        hide(this.container)
    }

    setPage(page_id) {
        if (page_id > this.pages_counter || page_id < 1)
            throw new Error(`There were only ${this.pages_counter} pages added`)

        hide(this.container.children())
        show(this.container.children(`.page-${page_id}`))
    }

    addPage(content) {
        this.container.append(`<div class="popup-page page-${++this.pages_counter} display-block">${content}</div>`)
        return this.pages_counter
    }
}