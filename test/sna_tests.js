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

test('the addition op errors on 32-bit SerialNumbers', function(t) {
    t.plan(2);

    var sn32_1 = SerialNumber(0xFFFFFFFF, 32);
    var sn32_2 = SerialNumber(-1, 32);
    var sn32_3 = SerialNumber(0xFFFFFFFF, 32);
    t.throws(function () {
        sn32_1.add(sn32_2);
    }, 'exception if adding negative SN');
    t.throws(function () {
        sn32_1.add(sn32_3);
    }, 'exception if adding more than maxAdd');

    t.end();
});

test('the trivial example from 5.1 RFC 1982', function(t) {
    t.plan(9);

    var sn = SerialNumber(0, 2);
    var sn_addOutOfRange = SerialNumber(2, 2);
    t.throws(function () {
        sn.add(sn_addOutOfRange);
    }, 'exception if adding more than 1 to space of size 2');

    var sn_0 = SerialNumber(0, 2);
    var sn_1 = SerialNumber(1, 2);
    var sn_2 = SerialNumber(2, 2);
    var sn_3 = SerialNumber(3, 2);

    var sn_add = SerialNumber(1, 2);
    t.equal(sn.add(sn_add), 1);
    t.ok(sn.gt(sn_0), '1 > 0 is true');
    t.equal(sn.add(sn_add), 2);
    t.ok(sn.gt(sn_1), '2 > 1 is true');
    t.equal(sn.add(sn_add), 3);
    t.ok(sn.gt(sn_2), '3 > 2 is true');
    t.equal(sn.add(sn_add), 0);
    t.ok(sn.gt(sn_3), '0 > 3 is true');

    t.end();
});

test('the larger example from 5.1 RFC 1982', function(t) {
    t.plan(15);

    var sn_0 = SerialNumber(0, 8);
    var sn_255 = SerialNumber(255, 8);
    var sn_100_1 = SerialNumber(100, 8);
    var sn_200 = SerialNumber(200, 8);
    var sn_1 = SerialNumber(1, 8);
    var sn_100_2 = SerialNumber(100, 8);
    var sn_44 = SerialNumber(44, 8);

    t.ok(sn_1.gt(sn_0), '1 > 0');
    t.ok(sn_44.gt(sn_0), '44 > 0');
    t.ok(sn_100_2.gt(sn_0), '100 > 0');
    t.ok(sn_100_2.gt(sn_44), '100 > 44');
    t.ok(sn_200.gt(sn_100_2), '200 > 100');
    t.ok(sn_255.gt(sn_200), '255 > 200');
    t.ok(sn_0.gt(sn_255), '0 > 255');
    t.ok(sn_100_2.gt(sn_255), '100 > 255');
    t.ok(sn_0.gt(sn_200), '0 > 200');
    t.ok(sn_44.gt(sn_200), '44 > 200');

    var sn_add = SerialNumber(127, 8);
    var sn_addOutOfRange = SerialNumber(128, 8);
    t.throws(function () {
        sn_0.add(sn_addOutOfRange);
    }, 'exception if adding more than 127 to 8 bit space');
    t.equal(sn_0.add(sn_add), 127);

    t.equal(sn_255.add(sn_1), 0);
    t.equal(sn_100_1.add(sn_100_2), 200);
    t.equal(sn_200.add(sn_100_2), 44);

    t.end();
});

test('getting number from SerialNumber', function(t) {
    t.plan(10);

    var sn = SerialNumber(255, 8);
    t.equal(sn.getNumber(), '255');
    t.equal(sn.getNumber({radix: 10}), '255');
    t.equal(sn.getNumber({radix: 16}), 'ff');
    t.equal(sn.getNumber({string: false}), 255);
    t.equal(sn.getNumber({radix: 10, string: false}), 255);
    t.equal(sn.getNumber({radix: 16, string: false}), 0xFF);

    // Construct serial number as little endian 0x12345678 and get big endian
    //encoded output using various options for getNumber method
    var sn_e = SerialNumber(0x12345678, 32);
    t.equal(sn_e.getNumber({encoding: 'BE'}), '2018915346');
    t.equal(sn_e.getNumber({encoding: 'BE', radix: 16}), '78563412');
    t.equal(sn_e.getNumber({encoding: 'BE', radix: 10}), '2018915346');
    t.equal(sn_e.getNumber({encoding: 'BE', radix: 16, string: false}), 0x78563412);

    t.end();
});

test('getting space from SerialNumber', function(t) {
    t.plan(2);

    var sn = SerialNumber(0xFF, 8);
    t.equal(sn.getSpace(), 8);
    t.equal(sn.getSpace(true), 1);

    t.end();
})
