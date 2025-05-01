let isRunning = false;
let lastTimestamp = null;
let bpm, beatsPerMeasure, subdivisions, totalSubdivisions;
let anglePerSub, subIndex = 0;
let tickTime = 0;
let nextTick = 0;

function toggleMetronome() {
  const tick = document.getElementById("tick");
  const tickAccent = document.getElementById("tick-acento");
  const tickSub = document.getElementById("tick-sub");

  bpm = parseInt(document.getElementById("bpm").value);
  beatsPerMeasure = parseInt(document.getElementById("compasso").value);
  subdivisions = parseInt(document.getElementById("subdivisoes").value);
  totalSubdivisions = beatsPerMeasure * subdivisions;
  anglePerSub = 360 / totalSubdivisions;
  tickTime = (60000 / bpm) / subdivisions;

  subIndex = 0;
  nextTick = 0;
  lastTimestamp = null;

  desenharSubdivisoes(beatsPerMeasure, subdivisions);

  if (isRunning) {
    isRunning = false;
    return;
  }

  isRunning = true;
  requestAnimationFrame(animate);
}

function animate(timestamp) {
  if (!isRunning) return;

  if (!lastTimestamp) lastTimestamp = timestamp;
  const elapsed = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  nextTick -= elapsed;

  const hand = document.getElementById("hand");
  const angle = ((performance.now() / tickTime) % totalSubdivisions) * anglePerSub;
  hand.style.transform = `rotate(${angle}deg)`;

  if (nextTick <= 0) {
    const isAccent = subIndex === 0;
    const isFirstSub = subIndex % subdivisions === 0;

    const tick = document.getElementById("tick");
    const tickAccent = document.getElementById("tick-acento");
    const tickSub = document.getElementById("tick-sub");

    if (isAccent) {
      tickAccent.currentTime = 0;
      tickAccent.play();
    } else if (isFirstSub) {
      tick.currentTime = 0;
      tick.play();
    } else {
      tickSub.currentTime = 0;
      tickSub.play();
    }

    subIndex = (subIndex + 1) % totalSubdivisions;
    nextTick += tickTime;
  }

  requestAnimationFrame(animate);
}

function desenharSubdivisoes(beatsPerMeasure, subdivisions) {
  const total = beatsPerMeasure * subdivisions;
  const circle = document.getElementById("circle");

  // Remove subdivisões anteriores
  document.querySelectorAll('.subdivision').forEach(el => el.remove());

  for (let i = 0; i < total; i++) {
    const div = document.createElement("div");
    div.classList.add("subdivision");
    if (i % subdivisions === 0) div.classList.add("acento");

    const angle = (360 * i) / total;
    div.style.transform = `rotate(${angle}deg) translateY(-90px)`;
    circle.appendChild(div);
  }
}






