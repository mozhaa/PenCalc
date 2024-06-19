$(document).on("turbo:load", function() {
    let index = 0
    $(".show-measure-units").replaceWith(function() {
        index++
        var new_input = $(this).clone().attr("data-pre-id", index).wrap("<div></div>").parent().html()
        return `
<div style="position: relative">
    ${new_input}
    <div style="position: absolute; left: 0; top: 0; pointer-events: none">
        <pre id="mu-hidden-${index}" style="visibility: hidden; display: inline"></pre><pre id="mu-units-${index}" style="display: none; overflow: hidden"> ${$(this).attr("data-units")}</pre>
    </div>
</div>`
    })
    $(".show-measure-units").on("input", function() {
        var index = $(this).attr("data-pre-id")
        var text = $(this).val()
        $(`#mu-hidden-${index}`).text(text)
        if (text.length)
            $(`#mu-units-${index}`).css('display', 'inline')
        else
            $(`#mu-units-${index}`).css('display', 'none')
    })
})