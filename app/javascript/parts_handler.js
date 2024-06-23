class PartsHandler {
    constructor(parts_list_id, canvas_handler) {
        this.parts_list = $(`#${parts_list_id}`)
        this.canvas_handler = canvas_handler
        
        this.parts = []
    }

    loadStructure(s) {
        s.forEach((x) => { this.addPart(new Part(x)) })
    }

    addPart(part) {
        this.canvas_handler.addPart(part)
        this.parts.push(part)
        this.#show()
    }

    deletePart(id) {
        this.canvas_handler.deletePart(id)
        this.parts.filter((part) => part.id != id)
        this.#show()
    }

    #show() {
        this.parts_list.html("")
        this.parts.forEach((part) => {
            this.parts_list.append(part.html())
        })
    }
}