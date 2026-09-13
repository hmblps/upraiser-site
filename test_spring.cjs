const { spring } = require('popmotion');

const s = spring({
  from: 1,
  to: 2,
  stiffness: 160,
  damping: 28,
  mass: 0.95
});

let time = 0;
let val = 1;
let stopped = false;
console.log("Time (ms) | Phase | tvOpacity");
while (!stopped && time < 4000) {
  const state = s.next();
  val = state.value;
  const tvDist = Math.abs(2 - val);
  const tvOpacity = Math.max(0, 1 - tvDist * 2.5);
  if (time % 100 === 0) {
     console.log(`${time.toString().padStart(9)} | ${val.toFixed(3)} | ${tvOpacity.toFixed(3)}`);
  }
  if (state.done) stopped = true;
  time += 16.666;
}
