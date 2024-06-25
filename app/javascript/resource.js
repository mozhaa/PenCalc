class Resource {
    constructor() {
        this.handlersCounter = 0
        this.handlers = []    
    }

    createResourceHandler() {
        let handler_id = this.handlersCounter++
        let handler = new ResourceHandler(handler_id, this)
        this.handlers.push(handler)
        return handler
    }

    update(handler_id, type, params) {
        this.handlers.forEach((handler) => {
            if (handler.id != handler_id)
                handler.receiveUpdate(type, params)
        })
    }
}

class ResourceHandler {
    constructor(id, resource) {
        this.id = id
        this.resource = resource
        this.actions = {}
    }

    setAction(type, action) {
        this.actions[type] = action
    }

    receiveUpdate(type, params) {
        this.actions[type](params)
    }

    sendUpdate(type, params) {
        this.resource.update(this.id, type, params)
    }
}