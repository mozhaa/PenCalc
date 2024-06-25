function ArgumentException(msg) {
    this.message = msg
    this.name = "ArgumentException"
}

class Part {
    static #id_counter = 0
    
    constructor(info) {
        this.id = Part.#id_counter++
        this.name = info["name"]
        this.mass = parseFloat(info["mass"])
        this.width = parseFloat(info["width"])
        this.pos = parseFloat(info["pos"])
        this.color = info["color"]

        if (isNaN(this.mass))
            throw new ArgumentException("Mass should be a floating-point number (for example 4.3)")
        if (this.mass <= 0)
            throw new ArgumentException("Mass should be positive")
        if (isNaN(this.width))
            throw new ArgumentException("Length should be a floating-point number (for example 5.15)")
        if (this.width <= 0)
            throw new ArgumentException("Length should be positive")        
    }

    static byForm(form) {
        let info = { "pos": "0" }
        form.serializeArray().forEach((prop) => {
            info[prop["name"]] = prop["value"]
        })
        return new Part(info)
    }

    static copy(part) {
        return new Part({
            name: part.name + " copy",
            mass: part.mass,
            width: part.width,
            pos: part.pos,
            color: part.color
        })
    }

    html() {
        return `
<li id="part-${this.id}" data-id="${this.id}" class="part hover-darker-1">
    <span class="color-tag" style="background-color: ${this.color}"></span>
    <span class="name-tag">${this.name}</span>
    <span class="mass-tag">${this.mass} g</span>
    <span class="width-tag">${this.width} cm</span>
</li>`
    }
}