class PartsHandler {
    constructor(parts_list_id) {
        this.eventHandlers = {
            "part:add": function(part) {},
            "part:delete": function(id) {}
        }

        this.parts_list = $(`#${parts_list_id}`)
        
        this.parts = []
    }

    addEventListener(event_name, handler) {
        if (!(event_name in this.eventHandlers)) {
            throw new Error(`Unknown event: ${event_name}`)
        }
        this.eventHandlers[event_name] = handler
    }

    loadStructure(s) {
        s.forEach((x) => { this.addPart(new Part(x)) })
    }

    addPart(part) {
        this.parts.push(part)
        this.#show()
        this.eventHandlers["part:add"](part)
    }
    
    movePart(id, offset) {
        this.parts = this.parts.map((part) => {
            if (part.id == id)
                part.pos += offset
            return part
        })
    }

    deletePart(id) {
        this.parts.filter((part) => part.id != id)
        this.#show()
        this.eventHandlers["part:delete"](id)
    }

    #show() {
        this.parts_list.html("")
        this.parts.forEach((part) => {
            this.parts_list.append(part.html())
        })
    }
}