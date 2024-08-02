$(document).on("turbo:load", function() {
    // run only on 'Editor' page
    if (!(window.controller == "mods" && window.action === "new")) return
    
    let selection = new Resource()
    let parts_list = new Resource()

    // pass to canvas handler canvas id and control-buttons ids
    let canvas_handler = new CanvasHandler("editor-canvas",
        {
            zoom_in: "controls-zoom-in",
            zoom_out: "controls-zoom-out",
            pan_left: "controls-pan-left",
            pan_right: "controls-pan-right",
        },
        selection.createResourceHandler(),
        parts_list.createResourceHandler()
    )

    // selectable list for parts list element
    let selectable_list = new SelectableList("parts-list", selection.createResourceHandler())
    
    // parts handler
    // all operations with parts should be performed using this handler
    let parts_handler = new PartsHandler("parts-list", 
        selection.createResourceHandler(), 
        parts_list.createResourceHandler()
    )

    // part form handler
    let form_handler = new FormHandler("part-form", (part) => { parts_handler.addPart(part) })

    // make form handler global for use in search bar
    window.form_handler = form_handler

    // load structure from structure element
    parts_handler.loadStructure($("#data-element").data("structure"))

    // bind tool buttons
    $(".duplicate-tool").on("click", (event) => {
        parts_handler.moveParts(parts_handler.duplicateParts(selectable_list.getSelectionIds()), 10)
    })
    $(".delete-tool").on("click", (event) => {
        parts_handler.deleteParts(selectable_list.getSelectionIds())
    })
    $(".mirror-tool").on("click", (event) => {
        parts_handler.mirrorPartsByRightEdge(parts_handler.duplicateParts(selectable_list.getSelectionIds()))
    })
    $(".cut-tool").on("click", (event) => {
        let popup = new Popup(`
<h3>Cut <span>tip1</span></h3>

<div class="cut-method-container">
<label>
    <input type="radio" name="cut-method" value="length-method" checked />
    by length
</label>

<div class="cut-form">
    <label>
    Length to cut (cm)
    <input type="text" name="length" id="cut-length">
    </label>
</div>
</div>

<div class="cut-method-container">
<label>
    <input type="radio" name="cut-method" value="ratio-method" />
    by ratio
</label>

<div class="cut-form">
    <label>
    Ratio to cut (f.e. 1:1 or 2:3)
    <input type="text" name="ratio" id="cut-ratio">
    </label>
</div>
</div>

<span class="error-message"></span>
<input type="button" value="Cut">
        `)
    })

    window.parts_handler = parts_handler
    window.canvas_handler = canvas_handler
    
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
        "pos": "-1",
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