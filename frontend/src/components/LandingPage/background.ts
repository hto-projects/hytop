const nstars = 300;
const height = 2000;

export function generateStars() {
  const layers: [string, number][] = [
    ["stars-close", 0.55],
    ["stars-mid", 0.45],
    ["stars-far", 0.35]
  ];

  layers.forEach(([id, opacity]) => {
    let element = document.getElementById(id);
    let stars = [];

    for (let i = 0; i < nstars; i++) {
      const x = Math.floor(Math.random() * window.innerWidth);
      const y = Math.floor(Math.random() * height);
      const color = `rgba(255, 255, 255, ${opacity})`;
      stars.push(`${x}px ${y}px ${color}`);
    }

    element.style.boxShadow = stars.join(", ");
  });
}

window.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--y", `${e.clientY}px`);
});
