class PartsHandler {
    constructor(parts_list_id, parts_list_r) {
        this.parts_list = $(`#${parts_list_id}`)
        
        this.parts_list_r = parts_list_r
        this.parts_list_r.setAction("part:add", (params) => {
            this.#addPart(params["part"])
        })
        this.parts_list_r.setAction("part:delete", (params) => {
            this.#deletePart(params["id"])
        })
        this.parts_list_r.setAction("part:move", (params) => {
            this.#movePart(params["id"], params["offset"])
        })

        this.parts = []
    }

    loadStructure(s) {
        s.forEach((x) => { this.addPart(new Part(x)) })
    }

    getPartById(id) {
        return this.parts.find((part) => part.id == id)
    }

    #addPart(part) {
        this.parts.push(part)
        this.#show()
    }

    addPart(part) {
        this.#addPart(part)
        this.parts_list_r.sendUpdate("part:add", { part: part })
        return part.id
    }
    
    #movePart(id, offset) {
        this.parts = this.parts.map((part) => {
            if (part.id == id)
                part.pos += offset
            return part
        })
    }

    movePart(id, offset) {
        this.#movePart(id, offset)
        this.parts_list_r.sendUpdate("part:move", { id: id, offset: offset })
        return id
    }

    #deletePart(id) {
        this.parts = this.parts.filter((part) => part.id != id)
        this.#show()
    }

    deletePart(id) {
        this.#deletePart(id)
        this.parts_list_r.sendUpdate("part:delete", { id: id })
    }

    mirrorPart(id, x) {
        let part = this.getPartById(id)
        return this.movePart(id, 2 * x - 2 * part.pos - part.width)
    }

    duplicatePart(id) {
        return this.addPart(Part.copy(this.getPartById(id)))
    }
    
    // mass actions

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