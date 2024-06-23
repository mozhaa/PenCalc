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

    constructor(canvas, controls) {
        this.eventHandlers = {
            "selection:change": function(ids) {},
            "part:move": function(id, offset) {}
        }

        // initialize fabric.js canvas
        this.canvas = new fabric.Canvas(canvas)
        this.canvas_id = canvas

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
                    this.eventHandlers["part:move"](obj.part_id, offset)
                })
            } else {
                // selection is one object
                this.eventHandlers["part:move"](selection.part_id, offset)
            }

            this.isMoving = false
        })

        // bind mouse events to pan/zoom
        this.canvas.on("mouse:wheel", (opt) => {
            var delta = opt.e.deltaY
            this.zoomOut(delta)
            opt.e.preventDefault()
            opt.e.stopPropagation()
        })

        this.canvas.on("mouse:down", function(opt) {
            // panning is alt+drag
            if (opt.e.altKey === true) {
                this.isDragging = true
                this.selection = false
                this.lastPosX = opt.e.clientX
            }
        })

        this.canvas.on('mouse:move', function(opt) {
            if (this.isDragging) {
                this.viewportTransform[4] += opt.e.clientX - this.lastPosX
                this.requestRenderAll()
                this.lastPosX = opt.e.clientX
            }
        })

        this.canvas.on('mouse:up', function(opt) {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.setViewportTransform(this.viewportTransform)
            this.isDragging = false
            this.selection = true
        })

        // update dimensions and Y-pan on each window resize
        $(window).resize(() => { this.updateDimensions() })
        // do it on initialization too
        this.updateDimensions()
        // and center X coordinate on initialization
        this.panLeft(this.canvas.width / 2)

        // draw horizontal axis
        this.canvas.add(new fabric.Line(
            [-10000, 0, 10000, 0], 
            { "stroke": "#111", "strokeWidth": 2, "selectable": false}
        ))

        // bind selection events for setting locks and triggering selection:change
        let selectionHandler = (obj) => {
            if (obj.selected && obj.selected[0].group) {
                // if selection is not one object, set locks
                // for one object locks are already set
                this.#setLocks(obj.selected[0].group)
            }
            if (this.listenSelections) {
                // get all ids from selection
                let ids = [] 
                if (obj.selected)
                    obj.selected.forEach((rect) => { ids.push(rect.part_id) })

                // trigger selection:change event
                this.eventHandlers["selection:change"](ids)
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

    addEventListener(event_name, handler) {
        if (!(event_name in this.eventHandlers)) {
            throw new Error(`Unknown event: ${event_name}`)
        }
        this.eventHandlers[event_name] = handler
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
        // disable selection:change triggering for manual changing
        this.listenSelections = false
        
        // remove previous selection
        this.canvas.discardActiveObject()
        
        // get rectangles by ids
        let rectangles = ids.map((id) => this.rectangles[id])
        
        // set new selection
        let selection = new fabric.ActiveSelection(rectangles, { canvas: this.canvas })
        this.canvas.setActiveObject(selection)
        
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

