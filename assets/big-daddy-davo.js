(() => {
  const art = document.querySelector(".big-daddy-art");
  if (!art) return;

  const font = {
    A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    G: ["01111", "10000", "10000", "10111", "10001", "10001", "01110"],
    I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"]
  };
  const words = ["BIG", "DADDY", "DAVO"];
  const extrusion = 5;
  const letterSpacing = 7;
  const maxWordWidth = Math.max(...words.map(word => word.length * letterSpacing - 2));
  const voxels = [];

  words.forEach((word, line) => {
    const wordWidth = word.length * letterSpacing - 2;
    const left = (maxWordWidth - wordWidth) / 2;
    [...word].forEach((letter, letterIndex) => {
      font[letter].forEach((row, y) => {
        [...row].forEach((on, x) => {
          if (on !== "1") return;
          for (let z = 0; z < extrusion; z += 1) {
            voxels.push({
              x: left + letterIndex * letterSpacing + x,
              y: line * 9 + y,
              z,
            });
          }
        });
      });
    });
  });

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const xAspect = 1.35;
  let frame = 0;
  let lastRender = 0;
  let animationFrame = 0;
  let running = false;

  function draw(angleY, angleX) {
    const centerX = (maxWordWidth - 1) / 2;
    const centerY = 13;
    const centerZ = (extrusion - 1) / 2;
    const cosineY = Math.cos(angleY);
    const sineY = Math.sin(angleY);
    const cosineX = Math.cos(angleX);
    const sineX = Math.sin(angleX);
    const focalLength = 90;

    const projected = voxels.map(({ x, y, z }) => {
      const localX = x - centerX;
      const localY = y - centerY;
      const localZ = z - centerZ;
      const rotatedX = localX * cosineY + localZ * sineY;
      const depthY = -localX * sineY + localZ * cosineY;
      const rotatedY = localY * cosineX - depthY * sineX;
      const depth = localY * sineX + depthY * cosineX;
      const perspective = focalLength / (focalLength - depth);
      return {
        x: rotatedX * perspective,
        y: rotatedY * perspective,
        depth,
      };
    });

    const minX = Math.min(...projected.map(point => point.x));
    const maxX = Math.max(...projected.map(point => point.x));
    const minY = Math.min(...projected.map(point => point.y));
    const maxY = Math.max(...projected.map(point => point.y));
    const columns = Math.ceil((maxX - minX) * xAspect) + 2;
    const rows = Math.ceil(maxY - minY) + 2;
    const cells = Array.from({ length: rows }, () => Array(columns).fill(" "));
    const depths = Array.from({ length: rows }, () => Array(columns).fill(-Infinity));

    projected.forEach((point) => {
      const column = Math.round((point.x - minX) * xAspect);
      const row = Math.round(point.y - minY);
      // Two terminal columns make each dollar-sign voxel read closer to a square pixel.
      for (let offset = 0; offset < 2; offset += 1) {
        const targetColumn = column + offset;
        if (targetColumn < columns && point.depth >= depths[row][targetColumn]) {
          depths[row][targetColumn] = point.depth;
          cells[row][targetColumn] = "$";
        }
      }
    });

    art.textContent = cells.map(row => row.join("").trimEnd()).join("\n");
  }

  function stop() {
    running = false;
    cancelAnimationFrame(animationFrame);
  }

  function animate(timestamp) {
    if (!running || document.hidden) return;
    if (timestamp - lastRender >= 70) {
      lastRender = timestamp;
      const elapsed = timestamp - frame;
      draw(elapsed * 0.00025 + 0.2, Math.sin(elapsed * 0.00023) * 0.1);
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function start() {
    stop();
    if (motionPreference.matches || document.hidden) {
      draw(0.2, 0);
      return;
    }
    frame = performance.now();
    lastRender = 0;
    running = true;
    animationFrame = requestAnimationFrame(animate);
  }

  motionPreference.addEventListener("change", start);
  document.addEventListener("visibilitychange", start);
  start();
})();
