import assert from "assert";
import totalPhoneBill from "../totalPhoneBill.js";

describe('totalPhoneBill Test', function () {
    it('should correctly calculate total for a given string of calls and SMS', function () {
        assert.equal('R7.45', totalPhoneBill('call, sms, call, sms, sms'));
        assert.equal('R3.40', totalPhoneBill('call, sms'));
        assert.equal('R1.30', totalPhoneBill('sms, sms'));
    });
});
