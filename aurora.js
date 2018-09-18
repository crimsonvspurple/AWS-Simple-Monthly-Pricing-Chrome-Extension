
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

        
        let down_arrows = $('.tab-title');
        $.each(down_arrows, function (index, value){
            console.log(value)
            $(value).click(function() {
                console.log("clicked")
                window.clearTimeout(timeoutHandle);
                timeoutHandle = window.setTimeout(modifyTable, 3 * 1000);
            });
        });
        
        
    }
    doneModify = true

    var table_headers = $('tr:contains("Price Per Hour")').not('tr:contains("Price Per Month")')
    var pattern = new RegExp("^\\$(\\d+\\.\\d+)$");
    var modified_cells = false;
    $.each(table_headers, function (index, value) {
        modified_cells = false;
        var cells = $(value).parent().parent().find('tr[data-plc-offer-id]');
        $.each(cells, function (index, value) {
            var message = $(value).find('td:last-child')[0].innerText;
            let matches = pattern.exec(message);
            if (matches != null && matches.length > 1) {
                modified_cells = true;
                let cost = parseFloat(matches[1]);
                let monthlyCost = (cost * 24 * 30.5).toFixed(2);
                value.innerHTML = value.innerHTML + '<td>$' + monthlyCost + '</td>';
            }
        });
        if (modified_cells) {
            value.innerHTML = value.innerHTML + '<th>Price Per Month</th>';
        }

    })
}

function error() {
    console.log("error loading table")
}



