jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

$(function() {
    let index = 0
    $(".show-measure-units").replaceWith(function() {
        index++
        var new_input = $(this).clone().attr("data-span-id", index).wrap("<div></div>").parent().html()
        console.log(new_input)
        return `
<div style="position: relative">
    ${new_input}
    <div style="position: absolute; left: 0; top: 0; pointer-events: none">
        <span id="mu-hidden-${index}" style="visibility: hidden"></span><span id="mu-units-${index}" style="visibility: hidden; overflow: hidden"> ${$(this).attr("data-units")}</span>
    </div>
</div>`
    })
    $(".show-measure-units").on("input", function() {
        var index = $(this).attr("data-span-id")
        var text = $(this).val()
        $(`#mu-hidden-${index}`).text(text)
        if (text.length)
            $(`#mu-units-${index}`).visible()
        else
            $(`#mu-units-${index}`).invisible()
    })
})