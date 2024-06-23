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
    
    // pass to parts handler parts list id
    // all operations with parts should be performed with this handler
    let parts_handler = new PartsHandler("parts-list")
    // bind part:add 'parts_handler -> canvas'
    parts_handler.addEventListener("part:add", (part) => { canvas_handler.addPart(part) })

    // load structure from structure element
    parts_handler.loadStructure($("#data-element").data("structure"))
    
    // selectable list for parts list element
    let selectable_list = new SelectableList("parts-list")
    // bind selection 'list -> canvas'
    selectable_list.addEventListener("selection:change", (ids) => { canvas_handler.setSelectionByIds(ids) })
    // bind selection 'canvas -> list'
    canvas_handler.addEventListener("selection:change", (ids) => { selectable_list.setSelectionByIds(ids) })

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