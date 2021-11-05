
var timeoutHandle = window.setTimeout(error, 20 * 1000);
var doneModify = false;

var observeTimeout = window.setTimeout(observeAndStart, 2 * 1000);

function observeAndStart() {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('awsui-table[data-test="pricing_table"]');

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        doneModify = false;
        window.clearTimeout(timeoutHandle);
        modifyTable();
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    observer.observe(targetNode, config);
    // observer.disconnect();
}

function modifyTable() {
    if (!doneModify) {
        window.clearTimeout(timeoutHandle);
        timeoutHandle = window.setTimeout(modifyTable, 1 * 1000);
    }

    doneModify = true
    const cells = Array.prototype.slice.call(document.querySelectorAll('awsui-table[data-test="pricing_table"] .awsui-table-container tr.awsui-table-row > td > span > span'), 0);
    const pattern = new RegExp("^\\$(\\d+\\.\\d+)$");

    cells.forEach(cell => {
        var message = cell.innerText;
        let matches = pattern.exec(message);
        if (matches != null && matches.length > 1) {
            let cost = parseFloat(matches[1]);
            let monthlyCost = (cost * 24 * 30.5).toFixed(2);
            cell.innerText = cell.innerText + ' | $' + monthlyCost;
        }
    });
}

function error() {
    console.log("error loading table")
}