$(document).on("turbo:load", function() {
    window.controller = $('meta[name=psj]').attr('controller')
    window.action = $('meta[name=psj]').attr('action')
})