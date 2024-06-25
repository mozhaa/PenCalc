class CanvasHandler {
    static xScale = 50
    static yScale = 50
    static controlsValues = {
        zoom_in: 100,
        zoom_out: 100,
        pan_left: 100,
        pan_right: 100
    }
    static zoomMax = 10
    static zoomMin = 0.1
    static panMax = 5000

    constructor(canvas, controls, selection_r, parts_list_r) {
        // initialize fabric.js canvas
        this.canvas = new fabric.Canvas(canvas)
        this.canvas_id = canvas

        this.selection_r = selection_r
        this.selection_r.setAction("selection:set", (params) => {
            this.setSelectionByIds(params["ids"])
        })

        this.parts_list_r = parts_list_r
        this.parts_list_r.setAction("part:add", (params) => {
            this.addPart(params["part"])
        })
        this.parts_list_r.setAction("part:delete", (params) => {
            this.deletePart(params["id"])
        })
        this.parts_list_r.setAction("part:move", (params) => {
            this.movePart(params["id"], params["offset"])
        })

        // bind control-buttons
        $(`#${controls["zoom_in"]}`).on("click", () => { 
            this.zoomIn(CanvasHandler.controlsValues["zoom_in"]) 
        })
        $(`#${controls["zoom_out"]}`).on("click", () => { 
            this.zoomOut(CanvasHandler.controlsValues["zoom_out"]) 
        })
        $(`#${controls["pan_left"]}`).on("click", () => { 
            this.panLeft(CanvasHandler.controlsValues["pan_left"]) 
        })
        $(`#${controls["pan_right"]}`).on("click", () => { 
            this.panRight(CanvasHandler.controlsValues["pan_right"]) 
        })

        // save mouse position on mouse:down
        this.canvas.on("mouse:down", (event) => {
            this.lastPos = event.absolutePointer.x
        })

        // if any object moved when dragging, need to update pos
        this.canvas.on("object:moving", (event) => {
            this.isMoving = true
        })
        
        // update pos, using saves and current mouse positions 
        this.canvas.on("mouse:up", (event) => {
            if (!this.isMoving) return

            let selection = this.canvas.getActiveObject()
            let offset = event.absolutePointer.x - this.lastPos
            if (selection._objects) {
                // selection consists of many objects
                selection._objects.forEach((obj) => {
                    this.parts_list_r.sendUpdate("part:move", { id: obj.part_id, offset: offset })
                })
            } else {
                // selection is one object
                this.parts_list_r.sendUpdate("part:move", { id: selection.part_id, offset: offset })
            }

            this.isMoving = false
        })

        // bind mouse events to pan/zoom
        this.canvas.on("mouse:wheel", (opt) => {
            var delta = opt.e.deltaY
            if (opt.e.shiftKey) {
                this.panLeft(delta)
            } else {
                this.zoomOut(delta)
            }
            opt.e.preventDefault()
            opt.e.stopPropagation()
        })

        this.canvas.on("mouse:down", (opt) => {
            // panning is alt+drag
            if (opt.e.altKey === true) {
                this.canvas.isDragging = true
                this.canvas.selection = false
                this.canvas.lastPosX = opt.e.clientX
            }
        })

        this.canvas.on('mouse:move', (opt) => {
            if (this.canvas.isDragging) {
                this.panLeft(opt.e.clientX - this.canvas.lastPosX)
                this.canvas.requestRenderAll()
                this.canvas.lastPosX = opt.e.clientX
            }
        })

        this.canvas.on('mouse:up', (opt) => {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.canvas.isDragging = false
            this.canvas.selection = true
        })

        // update dimensions and Y-pan on each window resize
        $(window).resize(() => { this.updateDimensions() })
        // do it on initialization too
        this.updateDimensions()
        // and center X coordinate on initialization
        this.panLeft(this.canvas.width / 2)

        // draw horizontal axis
        this.canvas.add(new fabric.Line(
            [-CanvasHandler.panMax * 3, 0, CanvasHandler.panMax * 3, 0], 
            { "stroke": "#111", "strokeWidth": 2, "selectable": false}
        ))

        // bind selection events for setting locks and triggering selection:change
        let selectionHandler = (obj) => {
            let selected = this.canvas.getActiveObjects()
            if (selected.length > 1 && selected[0].group) {
                // if selection is not one object, set locks
                // for one object locks are already set
                this.#setLocks(selected[0].group)
            }
            if (this.listenSelections) {
                // get all ids from selection
                let ids = selected.map((obj) => obj.part_id)

                // trigger selection resource update
                this.selection_r.sendUpdate("selection:set", { ids: ids })
            }
        }
        this.canvas.on("selection:updated", selectionHandler);
        this.canvas.on("selection:created", selectionHandler);
        this.canvas.on("selection:cleared", selectionHandler);

        // disable selection:change event listening, if manual change
        this.listenSelections = true

        // all rectangles by their part.id
        this.rectangles = {}
        
        this.canvas.renderAll()
    }
    
    updateDimensions() {
        // set canvas dimensions equal to parent container
        let dims = this.#getContainerDimensions()
        this.canvas.setDimensions(dims)

        // shift Y coordinate, so that Y = 0 is center
        let vpt = this.canvas.viewportTransform
        vpt[5] = this.canvas.height / 2
        this.canvas.setViewportTransform(vpt)
    }

    setSelectionByIds(ids) {
        // disable selection:set triggering for manual changing
        this.listenSelections = false
        
        // remove previous selection
        this.canvas.discardActiveObject()
        
        // get rectangles by ids
        let rectangles = ids.map((id) => this.rectangles[id])
        
        // set new selection
        if (rectangles.length > 0) {
            let selection = new fabric.ActiveSelection(rectangles, { canvas: this.canvas })
            this.canvas.setActiveObject(selection)
        }
        
        // render canvas
        this.canvas.requestRenderAll()
        
        this.listenSelections = true
    }
    
    addPart(part) {
        let info = {}
        
        info["width"] = part.width * CanvasHandler.xScale
        info["height"] = part.mass / part.width * CanvasHandler.yScale
        
        info["top"] = -info["height"] / 2
        info["left"] = part.pos
        
        let fill = new Color(part.color)
        fill.alpha *= 0.5
        info["fill"] = fill.toString({ format: "hex" })
        
        fill.lch.l *= 0.8
        info["stroke"] = fill.toString({ format: "hex" })
        info["strokeWidth"] = 2
        
        let rect = new fabric.Rect(info)
        this.#setLocks(rect)
        this.rectangles[part.id] = rect
        rect.part_id = part.id
        this.canvas.add(rect)
    }

    movePart(id, offset) {
        this.rectangles[id].left += offset
    }

    deletePart(id) {
        this.canvas.remove(this.rectangles[id])
    }
    
    zoomOut(delta) {
        let width = this.canvas.width
        let height = this.canvas.height
        let zoom = this.canvas.getZoom()
        zoom *= 0.999 ** delta
        zoom = Math.min(zoom, CanvasHandler.zoomMax)
        zoom = Math.max(zoom, CanvasHandler.zoomMin)
        this.canvas.zoomToPoint({ x: width / 2, y: height / 2 }, zoom)
    }
    
    zoomIn(delta) {
        this.zoomOut(-delta)        
    }
    
    panLeft(delta) {
        let vpt = this.canvas.viewportTransform
        vpt[4] += delta
        let lp = { x: 0, y: 0 }
        let rp = { x: this.canvas.width, y: 0 }
        let inv = fabric.util.invertTransform(vpt)
        let tlp = fabric.util.transformPoint(lp, inv) 
        let trp = fabric.util.transformPoint(rp, inv)
        if (tlp.x < -CanvasHandler.panMax || trp.x > CanvasHandler.panMax) {
            vpt[4] -= delta
            return
        }
        this.canvas.setViewportTransform(vpt)
    }
    
    panRight(delta) {
        this.panLeft(-delta)
    }

    #getContainerDimensions() {
        // get closest parent with class canvas-panel
        let canvas_panel = $(`#${this.canvas_id}`).closest(".canvas-panel")
        return { width: canvas_panel.width(), height: canvas_panel.height() }
    }
    
    #setLocks(obj) {
        obj.lockMovementY = true
        obj.lockSkewingX = true
        obj.lockSkewingY = true
        obj.lockRotation = true
        obj.lockScalingX = true
        obj.lockScalingY = true
        obj.setControlsVisibility({
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
}

