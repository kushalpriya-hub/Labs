const { Transform } = require("node:stream");

class RowsToJson extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
      readableObjectMode: true,
    });

    this.headers = null;
  }

  _transform(line, encoding, callback) {
    try {
      if (!this.headers) {
        this.headers = line.split(",");
        return callback();
      }

      const values = line.split(",");
      const row = {};

      this.headers.forEach((header, index) => {
        row[header] = values[index];
      });

      this.push(row);

      callback();
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = RowsToJson;