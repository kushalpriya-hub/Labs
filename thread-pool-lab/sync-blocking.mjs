import { pbkdf2Sync } from 'node:crypto';
import { monitorEventLoopDelay, performance } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 10 });

h.enable();

const start = performance.now();

let ticks = 0;

// This runs every 10 ms if the event loop is free.
const beat = setInterval(() => {
  ticks++;
}, 10);

for (let i = 0; i < 8; i++) {
  pbkdf2Sync(
    'secret',
    'salt',
    300_000,
    64,
    'sha512'
  );

  console.log(
    `job ${i} at ${Math.round(performance.now() - start)} ms`
  );
}

clearInterval(beat);

console.log(
  'beats:',
  ticks,
  'p99 delay ms:',
  h.percentile(99) / 1e6
);