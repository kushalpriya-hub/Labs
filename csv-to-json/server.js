const fs = require("node:fs");
const { pipeline } = require("node:stream/promises");
const { performance } = require("node:perf_hooks");

const LineSplitter = require("./lineSplitter");
const RowsToJson = require("./rowsToJson");
const JsonWriter = require("./jsonWriter");

function toMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

async function main() {
  const inputFile = "input-50MB.csv";
  const outputFile = "output.json";

  const initialRSS = process.memoryUsage().rss;
  let peakRSS = initialRSS;

  const start = performance.now();

  const monitor = setInterval(() => {
    peakRSS = Math.max(peakRSS, process.memoryUsage().rss);
  }, 50);

  const outputStream = fs.createWriteStream(outputFile);

  try {
    await pipeline(
      fs.createReadStream(inputFile, {
        highWaterMark: 64 * 1024,
      }),
      new LineSplitter(),
      new RowsToJson(),
      new JsonWriter(outputStream)
    );

    const finalRSS = process.memoryUsage().rss;
    const end = performance.now();

    console.log("Conversion completed!");
    console.log("Initial RSS:", toMB(initialRSS), "MB");
    console.log("Peak RSS:", toMB(peakRSS), "MB");
    console.log("Final RSS:", toMB(finalRSS), "MB");
    console.log(
      "Execution time:",
      ((end - start) / 1000).toFixed(2),
      "seconds"
    );
  } catch (error) {
    console.error("Conversion failed:", error.message);
  } finally {
    clearInterval(monitor);
  }
}

main();