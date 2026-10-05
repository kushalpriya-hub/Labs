const { Transform } = require("node:stream");

class LineSplitter extends Transform {
  constructor() {
    super({ readableObjectMode: true });
    this.remaining = "";
  }

  _transform(chunk, encoding, callback) {
    const text = this.remaining + chunk.toString();

    const lines = text.split(/\r?\n/);

    this.remaining = lines.pop();

    for (const line of lines) {
      if (line.length > 0) {
        this.push(line);
      }
    }

    callback();
  }

  _flush(callback) {
    if (this.remaining.length > 0) {
      this.push(this.remaining);
    }

    callback();
  }
}

module.exports = LineSplitter;