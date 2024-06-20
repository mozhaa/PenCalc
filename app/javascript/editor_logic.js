class Part {
    constructor(info) {
        this.name = info["name"]
        this.mass = parseFloat(info["mass"])
        this.len = parseFloat(info["len"])
        this.pos = parseFloat(info["pos"])
        this.color = info["color"]

        if (isNaN(this.mass))
            throw new Error("Mass should be a floating-point number (for example 4.3)")
        if (this.mass <= 0)
            throw new Error("Mass should be positive")
        if (isNaN(this.len))
            throw new Error("Length should be a floating-point number (for example 5.15)")
        if (this.len <= 0)
            throw new Error("Length should be positive")        
    }

    html() {
        return `
<li class="part hover-darker-1">
    <span class="color-tag" style="background-color: ${this.color}"></span>
    <span class="name-tag">${this.name}</span>
    <span class="mass-tag">${this.mass} g</span>
    <span class="len-tag">${this.len} cm</span>
</li>`
    }
}

class Structure {
    constructor(s) {
        this.parts = s.map((elem) => new Part(elem))
    }

    add_part(form) {
        let info = { "pos": "0" }
        form.serializeArray().forEach((prop) => {
            info[prop["name"]] = prop["value"]
        })
        let part = new Part(info)
        this.parts.push(part)
        this.show($(".parts-list"))
    }

    show(list) {
        list.html("")
        this.parts.forEach((part) => {
            list.append(part.html())
        })
    }
}

function formSubmit(form) {
    try {
        window.structure.add_part(form)
        form.find(":input.option[type=text]").val("").trigger("input")
    } catch (e) {
        alert(e.message)
    }
}

$(document).on("turbo:load", function() {
    if (!(window.controller === "mods" && window.action === "new")) return
    window.structure = new Structure($("#data-element").data("structure"))
    $(".part-form").attr("onsubmit", "formSubmit($(this))")
})