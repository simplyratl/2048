const colors = [
  { value: 2, colors: ["#72caf2", "#64a1da"], text: "#fff" },
  { value: 4, colors: ["#f16780", "#cd537c"], text: "#fff" },
  { value: 8, colors: ["#CC2936", "#08415C"], text: "#fff" },
  { value: 32, colors: ["#6AB547", "#628B48"], text: "#fff" },
  { value: 128, colors: ["#ffffff", "#ffcb64"], text: "#f16c84" },
  { value: 256, colors: ["#ffffff", "#39A9DB"], text: "#f16c84" },
  { value: 512, colors: ["#ffffff", "#8A84E2"], text: "#f16c84" },
  { value: 1024, colors: ["#ffffff", "#FF0054"], text: "#f16c84" },
  { value: 2048, colors: ["#ffffff", "#FF5400"], text: "#f16c84" },
  { value: 4096, colors: ["#ffffff", "#390099"], text: "#f16c84" },
  { value: 8192, colors: ["#D4AF37", "#9d8022"], text: "#fff" },
];

export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.15 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;

    colors.filter((color) => {
      if (color.value === v) {
        this.#tileElement.style.setProperty("--background-tile", color.colors[0]);
        this.#tileElement.style.setProperty("--tile-shadow", color.colors[1]);
        this.#tileElement.style.setProperty("--tile-text-color", color.text);
      }
    });
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
        once: true,
      });
    });
  }
}
