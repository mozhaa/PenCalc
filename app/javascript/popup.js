function show(elem) {
    elem.removeClass("display-none")
    elem.addClass("display-block")
}

function hide(elem) {
    elem.removeClass("display-block")
    elem.addClass("display-none")
}

class Popup {
    static id_count = 0

    constructor(content) {
        this.id_count = ++Popup.id_count
        this.id = `popup-container-${this.id_count}`

        $("body").append(
            `<div class="popup-container" id="${this.id}">
                <div class="popup-box">
                    <div class="popup-close-button hover-darker-1"></div>
                    <div class="popup-content-container">
                        ${content}
                    </div>
                </div>
            </div>`
        )

        this.container = $(`#${this.id}`)

        this.container.find(".popup-close-button").on("click", () => { this.close() })
    }

    show() {
        show(this.container)
    }
    
    hide() {
        hide(this.container)
    }

    close() {
        this.container.remove()
    }
}