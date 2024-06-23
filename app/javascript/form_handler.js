class FormHandler {
    constructor(form, submit_action) {
        this.form_id = form
        this.form = $(`#${form}`)
        this.submit_action = submit_action

        this.form.on("submit", (event) => { this.#submitHandler(event) })
    }

    #submitHandler(event) {
        let form = $(event.target)
        try {
            this.submit_action(Part.byForm(form))
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
    }

    fillForm(fields) {
        Object.entries(fields).forEach(([name, value]) => {
            this.form.find(`:input.option[name=${name}]`).val(value)
        })
    }
}