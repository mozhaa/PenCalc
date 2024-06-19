class Part {
    constructor(info) {
        this.name = info["name"]
        this.mass = parseFloat(info["mass"])
        this.len = parseFloat(info["len"])
        this.pos = parseFloat(info["pos"])
        this.color = info["color"]
    }
}

class Structure {
    constructor(s) {
        this.parts = s.map((elem) => new Part(elem))
    }

    add_part(form) {
        let info = { "pos": "0" }
        form.serializeArray().forEach((prop) => {info[prop["name"]] = prop["value"]})
        this.parts.push(new Part(info))
    }
}

function formSubmit(form) {
    window.structure.add_part(form)
    form.find(":input.option[type=text]").val("").trigger("input")
}

$(document).on("turbo:load", function() {
    if (!(window.controller === "mods" && window.action === "new")) return
    window.structure = new Structure($("#data-element").data("structure"))
    $(".part-form").attr("onsubmit", "formSubmit($(this))")
})