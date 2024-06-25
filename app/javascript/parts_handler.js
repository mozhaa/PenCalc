class PartsHandler {
    constructor(parts_list_id) {
        this.eventHandlers = {
            "part:add": { 
                handler: function(params) {}, 
                flag: false 
            },
            "part:delete": { 
                handler: function(params) {}, 
                flag: false 
            },
            "part:move": { 
                handler: function(params) {}, 
                flag: false 
            },
        }

        this.parts_list = $(`#${parts_list_id}`)
        
        this.parts = []
    }

    addEventListener(event_name, handler) {
        if (!(event_name in this.eventHandlers)) {
            throw new Error(`Unknown event: ${event_name}`)
        }
        this.eventHandlers[event_name].handler = handler
    }

    #triggerEvent(event_name, params) {
        let h = this.eventHandlers[event_name]
        h.flag = true
        h.handler(params)
        h.flag = false
    }

    #needToAnswer(event_name) {
        return !this.eventHandlers[event_name].flag
    }

    loadStructure(s) {
        s.forEach((x) => { this.addPart(new Part(x)) })
    }

    getPartById(id) {
        return this.parts.find((part) => part.id == id)
    }

    addPart(part) {
        this.parts.push(part)
        this.#show()
        this.#triggerEvent("part:add", { part: part })
        return part.id
    }
    
    movePart(id, offset) {
        this.parts = this.parts.map((part) => {
            if (part.id == id)
                part.pos += offset
            return part
        })
        this.#triggerEvent("part:add", { id: id, offset: offset })
        return id
    }

    deletePart(id) {
        this.parts.filter((part) => part.id != id)
        this.#show()
        if (!(this.silents["part:delete"]))
            this.eventHandlers["part:delete"](id)
    }

    mirrorPart(id, x) {
        let part = this.getPartById(id)
        return this.movePart(id, 2 * x - 2 * part.pos - part.width)
    }

    duplicatePart(id) {
        return this.addPart(Part.copy(this.getPartById(id)))
    }
    
    // 

    deleteParts(ids) {
        ids.forEach((id) => { this.deletePart(id) })
    }
    
    moveParts(ids, offset) {
        return ids.map((id) => this.movePart(id, offset))
    }

    mirrorParts(ids, x) {
        return ids.map((id) => this.mirrorPart(id, x))
    }

    duplicateParts(ids) {
        return ids.map((id) => this.duplicatePart(id))
    }

    #show() {
        this.parts_list.html("")
        this.parts.forEach((part) => {
            this.parts_list.append(part.html())
        })
    }
}