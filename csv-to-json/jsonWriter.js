const { Writable } = require("node:stream");

class JsonWriter extends Writable {
  constructor(outputStream) {
    super({ objectMode: true });

    this.outputStream = outputStream;
    this.first = true;

    this.outputStream.write("[\n");
  }

  _write(row, encoding, callback) {
    const prefix = this.first ? "" : ",\n";

    this.first = false;

    const data = prefix + JSON.stringify(row, null, 2);

    if (this.outputStream.write(data)) {
      callback();
    } else {
      this.outputStream.once("drain", callback);
    }
  }

  _final(callback) {
    this.outputStream.write("\n]\n", callback);
  }
}

module.exports = JsonWriter;