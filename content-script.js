
var timeoutHandle = window.setTimeout(error, 20 * 1000);
var doneModify = false;

$('.aws-plc-content').on("DOMSubtreeModified", function () {


    if (!doneModify) {
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(modifyTable, 3 * 1000);
    }
});

function modifyTable() {
    if (!doneModify) {
        let buttons = $(".aws-controls");
        $.each(buttons, function (index, value) {
            $($($(value).find('.button'))[0].children).click(function () {
                if ($(this).attr('class') != "js-active") {
                    window.clearTimeout(timeoutHandle);
                    timeoutHandle = window.setTimeout(modifyTable, 3 * 1000);
                }
            })
        });
    }

    doneModify = true
    const cells = Array.prototype.slice.call(document.querySelectorAll('tr[data-plc-offer-id] > td:last-child'), 0);
    const pattern = new RegExp("^\\$(\\d+\\.\\d+) per Hour$");
    $.each(cells, function (index, value) {
        var message = value.innerText;
        let matches = pattern.exec(message);
        if (matches != null && matches.length > 1) {
            let cost = parseFloat(matches[1]);
            let monthlyCost = (cost * 24 * 30.5).toFixed(2);
            value.innerText = value.innerText + ' | $' + monthlyCost + ' per Month';
        }
    });
}

function error() {
    console.log("error loading table")
}