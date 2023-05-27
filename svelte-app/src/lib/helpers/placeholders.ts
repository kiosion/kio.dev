import Fiona from 'fiona';
import Seedrandom from 'seedrandom';

interface PossibleColours {
  bg: string;
  colors: {
    start: string;
    end: string;
  }[];
}

const possibleColours = [
  {
    bg: '#d4e1ec',
    colors: [
      {
        start: '#d24188',
        end: '#ffe0e0'
      },
      {
        start: '#5056a9',
        end: '#d4e1ec'
      }
    ]
  },
  {
    bg: '#131A40',
    colors: [
      {
        start: '#99B7F9',
        end: '#829FD9'
      },
      {
        start: '#273273',
        end: '#131A40'
      }
    ]
  },
  {
    bg: '#485487',
    colors: [
      {
        start: '#F593A2',
        end: '#485487'
      },
      {
        start: '#CF7A48',
        end: '#E3371E'
      }
    ]
  }
] as PossibleColours[];

interface FionaImgOpts {
  width?: number;
  height?: number;
  bg?: string;
  colors?: PossibleColours['colors'];
}

export const fionaPlaceholder = (
  seed: string | number,
  opts = { width: 1000, height: 400 } as FionaImgOpts
) => {
  const { bg, colors } =
    possibleColours[Math.floor(Seedrandom(seed?.toString())() * possibleColours.length)];
  const scrambledSeed = seed
    .toString()
    .split('')
    .map((char, i) => {
      const entropy = Seedrandom(i.toString() + char.toString())();
      return entropy > 0.4 ? char : char.toUpperCase();
    })
    .join('');
  return Fiona(scrambledSeed).img({
    bg,
    colors,
    ...opts
  });
};

export const embedPlaceholder = (seed: string | number, opts?: FionaImgOpts) => {
  const img = fionaPlaceholder(seed, opts);

  // Construct an SVG using ForeignObject to have text inside the image
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${opts?.width}" height="${opts?.height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; font-size: 2rem; font-weight: bold; color: #fff;">
        <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;"/>
      </div>
    </foreignObject>
  </svg>`;
};
