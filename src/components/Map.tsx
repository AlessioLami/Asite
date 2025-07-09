
import c1 from "../assets/c1.png";
import c2 from "../assets/c2.png";
import c3 from "../assets/c3.png";
import c4 from "../assets/c4.png";
import c5 from "../assets/c5.png";
import c6 from "../assets/c6.png";
import c7 from "../assets/c7.png";
import c8 from "../assets/c8.png";


const BASE_WIDTH = 1500;
const BASE_HEIGHT = 1000;

const components = [
  { src: c1, x: 1190, y: 595, width: 272, height: 218 },
  { src: c2, x: 800, y: 600, width: 832, height: 104 },
  { src: c3, x: 705, y: 290, width: 94, height: 548 },
  { src: c4, x: 600, y: 360, width: 80, height: 548 },
  { src: c5, x: 640, y: 95, width: 1080, height: 106 },
  { src: c6, x: 250, y: 580, width: 508, height: 240 },
  { src: c7, x: 69, y: 700, width: 95, height: 356 },
  { src: c8, x: 330, y: 870, width: 670, height: 151 },
];

const componentsPercent = components.map(({ src, x, y, width, height }) => ({
  src,
  top: (y / BASE_HEIGHT) * 100 + "%",
  left: (x / BASE_WIDTH) * 100 + "%",
  width: (width / BASE_WIDTH) * 100 + "%",
  height: (height / BASE_HEIGHT) * 100 + "%",
}));

export default function Map() {
  return (
    <div
      className="relative w-full max-w-[1000px]"
      style={{ aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`}}
    >
      {componentsPercent.map(({ src, top, left, width, height }, i) => (
        <img
          key={i}
          src={src}
          alt={`component-${i}`}
          className="absolute hover:opacity-75 rounded-xl hover:bg-red-500/20 hover:border-4 hover:border-red-500"
          style={{ top, left, width, height, transform: "translate(-50%, -50%)" }}
        />
      ))}
    </div>
  );
}
