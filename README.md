# serial-arithmetic
This is an implementation of [RFC 1982](https://tools.ietf.org/html/rfc1982),
Serial Number Arithmetic in the Node.js runtime. Comparison and addition operations
along with a variable serial number space size are supported.

## Getting Started
Install serial-arithmetic with:

```sh
$ npm install serial-arithmetic --save
```

Almost all serial number methods are exposed:

```js
var SerialNumber = require('serial-arithmetic').SerialNumber;
var timestamp = SerialNumber(0, 32);
var anotherTimestamp = SerialNumber(255, 32);

console.log(timestamp.getNumber()); // -> '0'
console.log(timestamp.getSpace()); // -> 32
console.log(timestamp.gt(anotherTimestamp)); // -> true
```
See Usage section or the tests folder for more examples.

## Usage

#### SerialNumber([value,] [size])
Create a new SerialNumber object with an optional value and optional space size.
These default to 0 and 32 bits respectively.

#### sn.getNumber([options])
Retrieve the current number of the SerialNumber object with an optional options
object to format the returned number.

Available options are:
* options.radix = convert number to this base (i.e. 16 for hex output)
* options.encoding = currently supports 'BE' to encode output in big endian (for destination to network)
* options.string = false to output as number instead of default string

#### sn.getSpace([bytes])
Retrieve the serial number space size in bits or in bytes if bytes is true.

#### sn.add(other)
Add another SerialNumber to sn if the other SerialNumber is in range
```[0 .. 2 ^ (size - 1) - 1]```

#### sn.{eq|ne}(other)
Test equality of the sn to another SerialNumber.

#### sn.{lt|le|gt|ge}(other)
Test comparison of the sn to another SerialNumber.

## Tests
The current testing framework is tape. You may need to install tape globally:

```npm install -g tape```

Run test script:

```npm test```

## Notes
This package was created in hopes of being used in a future RTMP Node.js package. I'll
try to report back here if this implementation works for that specification or not!

Some of the weirder aspects of the spec made clearer by [twisted](https://github.com/twisted/twisted).
This package is heavily modeled after their Python implementation.
