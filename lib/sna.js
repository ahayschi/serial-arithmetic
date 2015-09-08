'use strict';

var util = require('util');


/*
 * Exposed methods
 */
exports.SerialNumber = function(value, size) {
    return new SerialNumber(value, size);
}

/*
 * SerialNumber constructor
 * @public
 *
 * @param {number} value The little endian encoded number
 * @param {number} size The size of the serial number space in bits
 */
function SerialNumber(value, size) {
    if (!(this instanceof SerialNumber)) {
        return new SerialNumber(value, size);
    }

    value = typeof value !== 'undefined' ? value : 0;
    size = typeof size !== 'undefined' ? size : 32;

    this.serialBits = size;
    this.serialBytes = size / 8;
    this._value = value;
    this._modulo = Math.pow(2, this.serialBits);
    this._half = Math.pow(2, this.serialBits - 1);
    this._maxAdd = this._half - 1;
    this.number = this._value % this._modulo;
}

/*
 * Equality comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.eq = function(that) {
    return this.number = that.number;
}

/*
 * Not equal comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.ne = function(that) {
    return this.number !== that.number;
}

/*
 * Less than comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.lt = function(that) {
    return (this.number < that.number && (that.number - this.number < this._half)) ||
            (this.number > that.number && (this.number - that.number > this._half));
}

/*
 * Greater than comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.gt = function(that) {
    return (this.number < that.number && (that.number - this.number > this._half)) ||
            (this.number > that.number && (this.number - that.number < this._half));
}

/*
 * Less than or equal comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.le = function(that) {
    return this.eq(that) || this.lt(that);
}

/*
 * Greater than or equal comparison with another SerialNumber
 * @public
 *
 * @param {SerialNumber} that SerialNumber to make comparison with
 */
SerialNumber.prototype.ge = function(that) {
    return this.eq(that) || this.gt(that);
}



// s1 is said to be less than s2 if, and only if, s1 is not equal to s2,
//    and
//
//         (i1 < i2 and i2 - i1 < 2^(SERIAL_BITS - 1)) or
//         (i1 > i2 and i1 - i2 > 2^(SERIAL_BITS - 1))
//
//    s1 is said to be greater than s2 if, and only if, s1 is not equal to
//    s2, and
//
//         (i1 < i2 and i2 - i1 > 2^(SERIAL_BITS - 1)) or
//         (i1 > i2 and i1 - i2 < 2^(SERIAL_BITS - 1))



/*
 * Return the number
 * @public
 *
 * @param {object} options Optional
 *  - {string} encoding Provide 'BE' to get number as big endian
 *  - {number} radix
 *  - {boolean} string Provide false to get number as integer
 */
SerialNumber.prototype.getNumber = function(options) {
    options = typeof options !== 'undefined' ? options : {};
    options.radix = options.radix ? options.radix : 10;
    options.string = options.string !== undefined ? options.string : true;

    var number = this.number.toString(options.radix);

    if (options.encoding === 'BE') {
        var buf = new Buffer(this.serialBytes);
        buf.writeUIntLE(this.number, 0, this.serialBytes);
        number = buf.readUIntBE(0, this.serialBytes).toString(options.radix);
    }

    if (options.string) {
        return number;
    } else {
        return parseInt(number, options.radix);
    }
}

/*
 * Override default toString method
 * @public
 */
SerialNumber.prototype.toString = function() {
    return "<number=" + this.number + ", bits=" + this.serialBits + ">";
}






// 0x0A0B0C0D (168496141)
// 0xd0c0b0a (218893066)
var foo = new SerialNumber(0x0A0B0C0D, 32);
console.log(foo.toString());
console.log(foo.getNumber({radix: 10}));
console.log(foo.getNumber({radix: 16}));
console.log(foo.getNumber({encoding: 'BE'}));
console.log(foo.getNumber({encoding: 'BE', radix: 16}));
console.log(foo.getNumber({encoding: 'BE', radix: 10, string: false}));
