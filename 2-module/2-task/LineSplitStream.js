const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    let string = chunk.toString();
    if (this._last) {
      string = this._last + string;
    }
    const stringArray = string.split(`${os.EOL}`);
    this._last = stringArray.splice(stringArray.length - 1, 1)[0];
    stringArray.forEach(this.push.bind(this));
    callback();
  }

  _flush(callback) {
    if (this._last) {
      this.push(this._last);
    }

    this._last = null;
    callback();
  }
}

module.exports = LineSplitStream;
