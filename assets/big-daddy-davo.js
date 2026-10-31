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
  const height = words.length * (9 + thickness + 2);
  const front = Array.from({ length: height }, () => Array(width).fill(" "));
  const sides = Array.from({ length: thickness }, () =>
    Array.from({ length: height }, () => Array(width).fill(" "))
  );

  words.forEach((word, wordIndex) => {
    const left = Math.floor((width - widthOf(word)) / 2);
    const top = wordIndex * (9 + thickness + 2);

    [...word].forEach((letter, letterIndex) => {
      glyphs[letter].forEach((row, y) => {
        [...row].forEach((pixel, x) => {
          if (pixel !== "1") return;
          const faceX = left + letterIndex * (7 + gap) + x;
          const faceY = top + y;
          front[faceY][faceX] = "$";

          for (let depth = 1; depth <= thickness; depth += 1) {
            sides[depth - 1][faceY + depth][faceX + depth] = "$";
          }
        });
      });
    });
  });

  function preLayer(className, rows) {
    return `<pre class="dollar-layer ${className}">${rows.map(row => row.join("")).join("\n")}</pre>`;
  }

  const sizing = Array.from({ length: height }, () => Array(width).fill("$")).map(row => row.join("")).join("\n");
  const depthLayers = sides
    .map((rows, index) => ({ depth: index + 1, rows }))
    .reverse()
    .map(({ depth, rows }) => preLayer(`dollar-side-${depth}`, rows))
    .join("");

  art.innerHTML = `<pre class="dollar-layer dollar-sizing">${sizing}</pre>${depthLayers}${preLayer("dollar-face", front)}`;
})();
