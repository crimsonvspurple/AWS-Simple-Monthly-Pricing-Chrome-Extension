
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
                };

            });
        });
    }
    doneModify = true

    var table_headers = $('tr:contains("Price Per Hour")').not('tr:contains("Price Per Month")')
    var cells = table_headers.parent().parent().find('tr[data-plc-offer-id]');
    var modified_cells = false;
    var pattern = new RegExp("^\\$(\\d+\\.\\d+)$");

    $.each(cells, function (index, value) {
        var message = $(value).find('td:last-child')[0].innerText;
        let matches = pattern.exec(message);
        if (matches != null && matches.length > 1) {
            modified_cells = true;
            console.log("inside")
            let cost = parseFloat(matches[1]);
            let monthlyCost = (cost * 24 * 30.5).toFixed(2);
            value.innerHTML = value.innerHTML + '<td>$' + monthlyCost + '</td>';
        }
    });

    if (modified_cells) {
        $.each(table_headers, function (index, value) {
            value.innerHTML = value.innerHTML + '<th>Price Per Month</th>';
        });
    }
}

function error() {
    console.log("error loading table")
}