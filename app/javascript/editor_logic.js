function ArgumentException(msg) {
    this.message = msg
    this.name = "ArgumentException"
}

class Part {
    static id_counter = 0
    constructor(info) {
        this.id = Part.id_counter++
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

class Structure {
    constructor(s) {
        this.parts = s.map((elem) => new Part(elem))
    }

    setCanvasHandler(canvas_handler) {
        this.canvas_handler = canvas_handler
    }

    addPart(part) {
        this.parts.push(part)
        this.canvas_handler.addPart(part)
        this.show($(".parts-list"))
    }

    addPartByForm(form) {
        let info = { "pos": "0" }
        form.serializeArray().forEach((prop) => {
            info[prop["name"]] = prop["value"]
        })
        let part = new Part(info)
        this.addPart(part)
        return part
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
        let part = window.structure.addPartByForm(form)
        window.canvas_handler.addPart(part)
        form.find(":input.option[type=text]").val("").trigger("input")
    } catch (e) {
        if (e instanceof ArgumentException)
            alert(e.message)
        else
            console.log(e.message)
    }
}

class CanvasHandler {
    static xScale = 50
    static yScale = 50

    constructor(canvas_id) {
        this.canvas_id = canvas_id
        this.canvas = new fabric.Canvas(canvas_id)

        // set correct width/height for canvas (change on window resize)
        $(window).resize(() => { this.updateDimensions() })
        $(window).trigger("resize")

        // set locks for whole selection, only X movement allowed
        this.canvas.on("selection:updated", (obj) => { this.selectionSetLocks(obj) });
        this.canvas.on("selection:created", (obj) => { this.selectionSetLocks(obj) });
            

        this.rectangles = {}
        
        this.canvas.renderAll()
    }

    selectionSetLocks(obj) {
        if (!obj.selected[0].group) return
        obj.selected[0].group.lockMovementY = true
        obj.selected[0].group.lockSkewingX = true
        obj.selected[0].group.lockSkewingY = true
        obj.selected[0].group.lockRotation = true
        obj.selected[0].group.lockScalingX = true
        obj.selected[0].group.lockScalingY = true
        obj.selected[0].group.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mtr: false
        })
    }

    setStructure(structure) {
        this.structure = structure
    }

    calculatePartStats(part) {
        let dims = this.getDimensions()
        let stats = {}
        stats["width"] = part.width * CanvasHandler.xScale
        stats["height"] = part.mass / part.width * CanvasHandler.yScale
        stats["top"] = dims["height"] / 2 - stats["height"] / 2
        stats["left"] = dims["width"] / 2 + part.pos
        stats["fill"] = part.color
        return stats
    }

    getDimensions() {
        let canvas_panel = $(`#${this.canvas_id}`).closest(".canvas-panel")
        return { "width": canvas_panel.width(), "height": canvas_panel.height() }
    }

    updateDimensions() {
        let dims = this.getDimensions()
        this.canvas.setDimensions(dims)
        // TODO: move all objects in the center
    }

    addPart(part) {
        let rect = new fabric.Rect(this.calculatePartStats(part));
        rect.lockMovementY = true;
        rect.lockSkewingX  = true;
        rect.lockSkewingY  = true;
        rect.lockRotation  = true;
        rect.lockScalingX  = true;
        rect.lockScalingY  = true;
        
        rect.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mtr: false
        });
        this.rectangles[part.id] = rect
        this.canvas.add(rect)
    }
}

$(document).on("turbo:load", function() {
    if (!(window.controller === "mods" && window.action === "new")) return

    window.structure = new Structure($("#data-element").data("structure"))
    window.canvas_handler = new CanvasHandler("editor-canvas")

    window.structure.setCanvasHandler(window.canvas_handler)
    window.canvas_handler.setStructure(window.structure)
    
    $(".part-form").attr("onsubmit", "formSubmit($(this))")
    
    // debug
    window.structure.addPart(new Part({
        "name": "A",
        "mass": "5",
        "width": "10",
        "pos": "-5",
        "color": "#ff0000"
    }))
    window.structure.addPart(new Part({
        "name": "B",
        "mass": "2",
        "width": "1",
        "pos": "0",
        "color": "#00ff00"
    }))
    window.structure.addPart(new Part({
        "name": "C",
        "mass": "2",
        "width": "1",
        "pos": "6",
        "color": "#0000ff"
    }))
    window.structure.addPart(new Part({
        "name": "D",
        "mass": "4.3",
        "width": "5.15",
        "pos": "-7",
        "color": "#ffff00"
    }))
    window.structure.addPart(new Part({
        "name": "E",
        "mass": "1",
        "width": "3",
        "pos": "3",
        "color": "#00ffff"
    }))
})