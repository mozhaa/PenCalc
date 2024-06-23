$(document).on("turbo:load", function() {
    // run only on 'Editor' page
    if (!(window.controller == "mods" && window.action === "new")) return
    
    // pass to canvas handler canvas id and control-buttons ids
    let canvas_handler = new CanvasHandler("editor-canvas",
        {
            zoom_in: "controls-zoom-in",
            zoom_out: "controls-zoom-out",
            pan_left: "controls-pan-left",
            pan_right: "controls-pan-right",
        }
    )

    // selectable list for parts list element
    let selectable_list = new SelectableList("parts-list")
    
    // parts handler
    // all operations with parts should be performed using this handler
    let parts_handler = new PartsHandler("parts-list")

    // event bindings
    parts_handler.addEventListener("part:add", (part) => { canvas_handler.addPart(part) })
    selectable_list.addEventListener("selection:change", (ids) => { canvas_handler.setSelectionByIds(ids) })
    canvas_handler.addEventListener("selection:change", (ids) => { selectable_list.setSelectionByIds(ids) })
    canvas_handler.addEventListener("part:move", (id, offset) => { parts_handler.movePart(id, offset) })
    
    // part form submit handler
    $("#part-form").on("submit", function (event) {
        let form = $(event.target)
        try {
            parts_handler.addPart(Part.byForm(form))
            // clear fields after success
            form.find(":input.option[type=text]").val("").trigger("input")
        } catch (e) {
            if (e instanceof ArgumentException) {
                // alert error messages from part constructor
                alert(e.message)
            } else {
                throw e
            }
        }
    })
    
    // load structure from structure element
    parts_handler.loadStructure($("#data-element").data("structure"))
    
    // debug
    parts_handler.addPart(new Part({
        "name": "barrel",
        "mass": "4",
        "width": "12",
        "pos": "0",
        "color": "#ff0000"
    }))
    parts_handler.addPart(new Part({
        "name": "cap1",
        "mass": "2",
        "width": "4",
        "pos": "0",
        "color": "#00ff00"
    }))
    parts_handler.addPart(new Part({
        "name": "cap2",
        "mass": "2",
        "width": "4",
        "pos": "0",
        "color": "#0000ff"
    }))
    parts_handler.addPart(new Part({
        "name": "tip1",
        "mass": "3",
        "width": "1",
        "pos": "0",
        "color": "#ffff00"
    }))
    parts_handler.addPart(new Part({
        "name": "tip2",
        "mass": "3",
        "width": "1",
        "pos": "0",
        "color": "#00ffff"
    }))
})