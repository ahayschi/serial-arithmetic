'use strict';

var test = require('tape').test;
var SerialNumber = require('../lib/sna').SerialNumber;


test('the creation of new nary-bit SerialNumbers with params', function (t) {
    t.plan(4);

    var sn8_1 = SerialNumber(0xFF, 8);
    var sn8_2 = SerialNumber(0xFF, 8);
    t.equal(sn8_1.getNumber(), sn8_2.getNumber());

    var sn16_1 = SerialNumber(0xFFFF, 16);
    var sn16_2 = SerialNumber(0xFFFF, 16);
    t.equal(sn16_1.getNumber(), sn16_2.getNumber());

    var sn24_1 = SerialNumber(0xFFFFFF, 24);
    var sn24_2 = SerialNumber(0xFFFFFF, 24);
    t.equal(sn24_1.getNumber(), sn24_2.getNumber());

    var sn32_1 = SerialNumber(0xFFFFFFFF, 32);
    var sn32_2 = SerialNumber(0xFFFFFFFF, 32);
    t.equal(sn32_1.getNumber(), sn32_2.getNumber());

    t.end();
});

test('the creation of new 32-bit SerialNumbers without params', function(t) {
    t.plan(4);

    var snDefault_1 = SerialNumber();
    t.equal(snDefault_1.number, 0);
    t.equal(snDefault_1.getSpace(), 32);

    var snDefault_2 = SerialNumber(0xFFFFFFFF);
    t.equal(snDefault_2.number, 0xFFFFFFFF);
    t.equal(snDefault_2.getSpace(true), 4);

    t.end();
});


test('the equality of 32-bit SerialNumbers', function(t) {
    t.plan(3);

    var sn32_1 = SerialNumber(0xFFFF, 32);
    var sn32_2 = SerialNumber(0xFFFF, 32);
    var sn32_3 = SerialNumber(0xFFFFF, 32);
    t.ok(sn32_1.eq(sn32_2), 'two 0xFFFF SN are equal');
    t.notOk(sn32_2.eq(sn32_3), 'two different SN eq is false');
    t.ok(sn32_1.ne(sn32_3), 'two different SN ne is true');

    t.end();
})

test('the lt and le comparisons on 32-bit SerialNumbers', function(t) {
    t.plan(4);

    var sn32_1 = SerialNumber(0xFF);
    var sn32_2 = SerialNumber(0xFFFF);
    t.ok(sn32_1.lt(sn32_2), 'sn1 is lt sn2');
    t.ok(sn32_1.le(sn32_2), 'sn1 is lt or le sn2');
    t.notOk(sn32_2.lt(sn32_1), 'sn2 is not lt sn1');
    t.notOk(sn32_2.le(sn32_1), 'sn2 is not le sn1');

    t.end();
})

test('the ht and ge comparisons on 32-bit SerialNumbers', function(t) {
    t.plan(4);

    var sn32_1 = SerialNumber(0xFFFF);
    var sn32_2 = SerialNumber(0xFF);
    t.ok(sn32_1.gt(sn32_2), 'sn1 is gt sn2');
    t.ok(sn32_1.ge(sn32_2), 'sn1 is gt or ge sn2');
    t.notOk(sn32_2.gt(sn32_1), 'sn2 is not gt sn1');
    t.notOk(sn32_2.ge(sn32_1), 'sn2 is not ge sn1');

    t.end();
})

test('the addition op on 32-bit SerialNumbers', function(t) {
    t.plan(2);

    var sn32_1 = SerialNumber(0xFFFFFFFF, 32);
    var sn32_2 = SerialNumber(-1, 32);
    var sn32_3 = SerialNumber(0xFFFFFF, 32);
    t.throws(function () {
        sn32_1.add(sn32_2);
    }, 'exception if adding negative SN');
    t.throws(function () {
        sn32_1.add(sn32_3);
    }, 'exception if adding more than maxAdd');


    t.end();
});







// 0x0A0B0C0D (168496141)
// 0xd0c0b0a (218893066)
// var foo = new SerialNumber(0x0A0B0C0D, 32);
// console.log(foo.toString());
// console.log(foo.getNumber({radix: 10}));
// console.log(foo.getNumber({radix: 16}));
// console.log(foo.getNumber({encoding: 'BE'}));
// console.log(foo.getNumber({encoding: 'BE', radix: 16}));
// console.log(foo.getNumber({encoding: 'BE', radix: 10, string: false}));
