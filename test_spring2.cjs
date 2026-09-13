function simulateSpring(stiffness, damping, mass, from, to) {
  let pos = from; let vel = 0; let t = 0; let dt = 1/60;
  let t14 = 0, t16 = 0, t19 = 0;
  while (Math.abs(pos - to) > 0.001) {
    let force = -stiffness * (pos - to) - damping * vel;
    let acc = force / mass;
    vel += acc * dt;
    pos += vel * dt;
    t += dt;
    if (!t14 && pos >= 1.4) t14 = t;
    if (!t16 && pos >= 1.6) t16 = t;
    if (!t19 && pos >= 1.9) t19 = t;
  }
  console.log(`Crosses 1.4 (Tablet disappears): ${t14.toFixed(2)}s`);
  console.log(`Crosses 1.6 (TV appears): ${t16.toFixed(2)}s`);
  console.log(`Crosses 1.9 (TV 90% opacity): ${t19.toFixed(2)}s`);
}
simulateSpring(160, 28, 0.95, 1, 2);
