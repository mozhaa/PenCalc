class SelectableList {
    constructor(object_id) {
        this.object = $(`#${object_id}`)
        this.eventHandlers = {
            "selection:change": function(selected_ids) {}
        }

        this.object.on("click", (event) => { this.#clickHandle(event) })
    }

    addEventListener(event_name, handler) {
        if (!(event_name in this.eventHandlers)) {
            throw new Error(`Unknown event: ${event_name}`)
        }
        this.eventHandlers[event_name] = handler
    }

    setSelectionByIds(ids) {
        // discard selection
        this.object.children("li").removeClass("sl-selected")
        // set new selection
        ids.forEach((id) => {
            this.object.children(`li[data-id=${id}]`).addClass("sl-selected")
        })
    }

    #clickHandle(event) {
        // get part object
        let part = $(event.target).closest("li")

        // if not ctrl, all previous selections get discarded
        if (!event.ctrlKey)
            this.object.children("li").removeClass("sl-selected")
        
        if (event.shiftKey) {
            // if first click is shift+click, then act like just click
            if (this.object.children("li.sl-current").length == 0) {
                this.object.children("li").removeClass("sl-current")
                part.addClass("sl-current sl-selected")
            } else {
                // select all between current and clicked
                // mark clicked as temporary
                part.addClass("sl-temporary")

                // iterate through all elements
                // set activate = true when between
                let activate = false
                this.object.children("li").each((_, elem) => {
                    if ($(elem).hasClass("sl-temporary") || $(elem).hasClass("sl-current")) {
                        if ($(elem).hasClass("sl-temporary") && $(elem).hasClass("sl-current")) {
                            // if clicked = current, just select it
                            $(elem).addClass("sl-selected")
                        } else {
                            // else, toggle activated
                            activate = !activate
                            if (!activate)
                                $(elem).addClass("sl-selected")
                        }
                    }

                    // when between, select all
                    if (activate)
                        $(elem).addClass("sl-selected")
                })

                // remove temporary class
                part.removeClass("sl-temporary")
            }
        } else {
            // if not shift click, just select if not, and vice-versa
            part.toggleClass("sl-selected")
        }   
        if (!(event.shiftKey && !event.ctrlKey)) {
            // keep current only if shift+click
            this.object.children("li").removeClass("sl-current")
            part.addClass("sl-current")
        }

        // trigger event selection:change
        let ids = []
        this.object.children("li.sl-selected").each((_, elem) => {
            ids.push($(elem).data("id"))
        })
        this.eventHandlers["selection:change"](ids)
    }
}