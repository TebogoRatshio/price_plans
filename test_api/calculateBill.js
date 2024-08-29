function totalPhoneBill(billString) {
    const billItems = billString.split(',').map(item => item.trim());
    let total = 0;

    billItems.forEach(item => {
        if (item === 'call') {
            total += 2.75;
        } else if (item === 'sms') {
            total += 0.65;
        }
    });

    return 'R' + total.toFixed(2);
}