(() => {
  const art = document.querySelector(".big-daddy-art");
  if (!art) return;

  const glyphs = {
    A: ["0111110", "1100011", "1100011", "1100011", "1111111", "1100011", "1100011", "1100011", "1100011"],
    B: ["1111110", "1100011", "1100011", "1100011", "1111110", "1100011", "1100011", "1100011", "1111110"],
    D: ["1111100", "1100110", "1100011", "1100011", "1100011", "1100011", "1100011", "1100110", "1111100"],
    G: ["0111111", "1100000", "1100000", "1100000", "1100111", "1100011", "1100011", "1100011", "0111111"],
    I: ["1111111", "0011100", "0011100", "0011100", "0011100", "0011100", "0011100", "0011100", "1111111"],
    O: ["0111110", "1100011", "1100011", "1100011", "1100011", "1100011", "1100011", "1100011", "0111110"],
    V: ["1100011", "1100011", "1100011", "1100011", "1100011", "0110110", "0110110", "0011100", "0011100"],
    Y: ["1100011", "1100011", "0110110", "0011100", "0011100", "0011100", "0011100", "0011100", "0011100"]
  };
  const words = ["BIG", "DADDY", "DAVO"];
  const gap = 3;
  const thickness = 3;
  const widthOf = word => word.length * 7 + (word.length - 1) * gap;
  const width = Math.max(...words.map(widthOf)) + thickness;
  const rows = Array.from({ length: words.length * (9 + thickness + 2) }, () => Array(width).fill(0));

  words.forEach((word, wordIndex) => {
    const faceWidth = widthOf(word);
    const left = Math.floor((width - faceWidth) / 2);
    const top = wordIndex * (9 + thickness + 2);

    [...word].forEach((letter, letterIndex) => {
      glyphs[letter].forEach((row, y) => {
        [...row].forEach((pixel, x) => {
          if (pixel !== "1") return;
          const faceX = left + letterIndex * (7 + gap) + x;
          const faceY = top + y;

          for (let depth = thickness; depth > 0; depth -= 1) {
            const sideX = faceX + depth;
            const sideY = faceY + depth;
            rows[sideY][sideX] = Math.max(rows[sideY][sideX], depth);
          }
          rows[faceY][faceX] = thickness + 1;
        });
      });
    });
  });

  function renderRow(cells) {
    let html = "";
    let currentType = -1;
    let run = "";

    const flush = () => {
      if (!run) return;
      if (currentType === 0) html += run;
      else if (currentType === thickness + 1) html += `<span class="dollar-face">${run}</span>`;
      else html += `<span class="dollar-side dollar-side-${currentType}">${run}</span>`;
      run = "";
    };

    for (let column = 0; column < cells.length; column += 1) {
      const type = cells[column];
      const character = type === 0 ? " " : "$";
      if (type !== currentType) {
        flush();
        currentType = type;
      }
      run += character;
    }
    flush();
    return html.trimEnd();
  }

  art.innerHTML = rows.map(renderRow).join("\n");
})();
