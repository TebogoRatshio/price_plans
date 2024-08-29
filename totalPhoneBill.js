// This is a simple implementation for the purpose of the example
function totalPhoneBill(billString) {
    const callCost = 2.75; // Cost per call in Rands
    const smsCost = 0.65;  // Cost per SMS in Rands

    let total = 0;

    if (billString) {
        const items = billString.split(', ');
        items.forEach(item => {
            if (item === 'call') total += callCost;
            if (item === 'sms') total += smsCost;
        });
    }

    return `R${total.toFixed(2)}`;
}

export default totalPhoneBill;
