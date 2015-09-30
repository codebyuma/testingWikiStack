var expect = require('chai').expect
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);

xit('does simple math', function(){
	expect(2+2).to.eql(4);
})


xit('confirms setTimeout\'s timer accuracy', function (done) {
    var start = new Date();
    setTimeout(function () {
        var duration = new Date() - start;
        expect(duration).to.be.closeTo(1000, 50);
        done();
    }, 1000);
});	

xit('chai spies', function () {
    
	var arr = [2, 4, 6];
	function plusTwo (num){
	    return num + 2;
	}
	
    plusTwo = chai.spy(plusTwo);
	arr.forEach(plusTwo);
	expect(plusTwo).to.have.been.called.exactly(3);
});	

xit('will invoke a function once per element', function () {
    var arr = ['x','y','z'];
    function logNth (val, idx) {
        console.log('Logging elem #'+idx+':', val);
    }
    logNth = chai.spy(logNth);
    arr.forEach(logNth);
    expect(logNth).to.have.been.called.exactly(arr.length);
});