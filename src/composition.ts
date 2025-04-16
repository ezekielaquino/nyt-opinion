import paper from 'paper';

const SPACING = 15;
const START_OFFSET = 0.1;

const PARAGRAPHS = [
  // first
  [
    [0.4, 1],
    [0, 1],
    [0, 0.6],
  ],
  // section 1
  [
    [START_OFFSET, 1],
    [0, 1],
  ],
  // section 2
  [
    [START_OFFSET, 1],
    [0, 0.6],
    [0.1, 1],
    [0, 1],
    [0.1, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0.1, 1],
  ],
  // section 3
  [
    [START_OFFSET, 1],
    [0, 1],
    [0, 0.3],
    [0.1, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 0.2],
    [0.1, 1],
    [0, 1],
    [0, 0.5],
    [0.1, 0.75],
    [0.1, 1],
    [0, 0.3],
    [0.1, 1],
    [0, 1],
    [0, 1],
    [0, 1],
    [0, 0.2],
  ],
  // section 4
  [
    [START_OFFSET, 1],
    [0, 1],
    [0, 0.3],
  ],
  // section 5
  [
    [START_OFFSET, 1],
    [0, 1],
    [0, 0.4],
    [0, 1],
    [0, 0.2],
  ],
  // section 6
  [
    [START_OFFSET, 1],
    [0, 1],
    [0, 1],
    [0, 0.2],
    [0.2, 1],
    [0, 1],
    [0, 0.5],
  ],
  // section 7
  [
    [START_OFFSET, 1],
    [0, 1],
    [0, 1],
    [0, 0.3],
  ],
];

const init = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);
};

const gray = new paper.Color('#111');

const drawFrame = () => {
  const rect = new paper.Path.Rectangle({
    point: new paper.Point(40, 40),
    size: paper.view.size.subtract(new paper.Size(80, 80)),
  });
};

const drawParagraph = ({
  lines,
  drawHeader,
}: {
  lines: number[][];
  drawHeader?: boolean;
}) => {
  let children = [];

  const width = paper.view.size.width - 80;

  const paragraphLines = lines.map(([startOffset, endOffset], index) => {
    const startX = width * startOffset;
    const endX = width * endOffset;
    const y = index * SPACING;

    const line = new paper.Path.Line({
      from: new paper.Point(startX, y),
      to: new paper.Point(endX, y),
    });

    line.strokeColor = gray;
    line.strokeWidth = 1.25;

    if (index === 0 && drawHeader) {
      const header = new paper.Path.Rectangle({
        point: new paper.Point(0, y - SPACING / 2),
        size: new paper.Size(width * START_OFFSET * 0.9, SPACING),
      });

      header.fillColor = gray;

      children.push(header);
    }

    children.push(line);

    return children;
  });

  return new paper.Group(paragraphLines.flat());
};

init();
drawFrame();

const paragraphs = PARAGRAPHS.reduce((result, current, index) => {
  const paragraph = drawParagraph({lines: current, drawHeader: index > 0});

  paragraph.position.y =
    index > 0
      ? result[index - 1].bounds.bottomLeft.y +
        paragraph.bounds.height / 2 +
        SPACING +
        (index === 1 ? SPACING * 2 : -SPACING / 2)
      : 40;

  return [...result, paragraph];
}, []);

const paragraphsGroup = new paper.Group(paragraphs);

paragraphsGroup.position = paper.view.bounds.bottomCenter.subtract(
  0,
  paragraphsGroup.bounds.height / 2 + 40,
);

// HEADLINES
const title = new paper.Path.Rectangle({
  point: new paper.Point(paragraphsGroup.bounds.topLeft),
  size: new paper.Size(paragraphsGroup.bounds.width * 0.4 * 0.95, 50),
});
title.position.y -= title.bounds.height;
title.fillColor = gray;

const subtitle = new paper.Path.Rectangle({
  point: new paper.Point(paragraphsGroup.bounds.topLeft),
  size: new paper.Size(paragraphsGroup.bounds.width * 0.2, SPACING * 2),
});
subtitle.position.x = paragraphsGroup.bounds.width * 0.4;
subtitle.position.y += SPACING * 2.8;
subtitle.fillColor = gray;

const concert = new paper.PointText({
  point: title.bounds.topRight,
});
concert.position = concert.position.add(SPACING, 15);
concert.content = 'Concerto';
concert.fontSize = 18;
concert.fontWeight = 'bold';
concert.fillColor = gray;

const tempo = new paper.PointText({
  point: new paper.Point(paragraphsGroup.bounds.topLeft.add(0, SPACING * 4)),
});

tempo.content = '(allegro maestoso.)';
tempo.fontSize = 18;
tempo.fontWeight = 'bold';
tempo.fillColor = gray;

// return an array of children which are lines in paragraphsGroup
const lines = paragraphsGroup.children
  .map(child => child.children)
  .flat()
  .filter(child => child.segments.length === 2);

const createRandomVerts = () => {
  const a = lines[Math.floor(Math.random() * lines.length)];
  const b = lines[Math.floor(Math.random() * lines.length)];

  const [lineA, lineB] = [a, b].sort((a, b) => b.length - a.length);

  const divs = lineA.length / (SPACING / 2);
  const offsetA = (Math.floor(Math.random() * divs) / divs) * lineA.length;

  const pointA = lineA.getPointAt(offsetA);
  const pointB = new paper.Point(pointA.x, lineB.position.y);

  const line = new paper.Path.Line({
    from: pointA,
    to: pointB,
  });

  line.strokeColor = gray;

  if (Math.random() > 0.75) {
    // const line2 = line.clone();
    // line2.position.x += 4;
    line.strokeWidth = 3;
  }

  return line;
};

[...Array(Math.floor(Math.random() * 10) + 2)].forEach(() => {
  createRandomVerts();
});

const loadImageAsDataURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
};

// Load and place the painting image
loadImageAsDataURL('painting1.png')
  .then(dataURL => {
    const painting = new paper.Raster(dataURL);

    painting.visible = false;

    painting.onLoad = () => {
      // Scale the image to fit within the paragraphsGroup while maintaining aspect ratio
      const scale = Math.min(
        (paragraphsGroup.bounds.width / painting.width) * 0.9,
        (paragraphsGroup.bounds.height / painting.height) * 0.9,
      );

      painting.scale(scale);

      // Align the image to the bottom right of the paragraphsGroup
      painting.position = paragraphsGroup.bounds.bottomRight.subtract(
        painting.bounds.width / 2,
        painting.bounds.height / 2,
      );

      // Create vertical lines and intersections after the painting is loaded and positioned
      const verticalLines = [...Array(61)].map((_, i) => {
        const x = paragraphsGroup.bounds.topRight.x - SPACING * i;
        const y = paragraphsGroup.bounds.topLeft.y;

        const line = new paper.Path.Line({
          from: new paper.Point(x, y),
          to: new paper.Point(x, y + paragraphsGroup.bounds.height),
        });

        return line;
      });

      let intersections = [];

      verticalLines.forEach(line => {
        lines.forEach(line2 => {
          const intersection = line.getIntersections(line2);
          if (intersection) {
            intersections.push(intersection);
          }
        });
      });

      // Create dots after the painting is fully positioned and scaled
      intersections.flat().forEach(intersection => {
        const dot = new paper.Path.Circle(intersection._point, 5);
        // Get the color from the raster at the intersection point
        const color = painting.getPixel(intersection._point);
        dot.fillColor = new paper.Color(color);

        if (Math.random() > Math.random() * 0.1 + 0.1) {
          dot.visible = false;
        }
      });
    };
  })
  .catch(error => {
    console.error('Failed to load image:', error);
  });

// paper.project.importSVG('/arrows.svg', item => {
//   item.position = paper.view.center;
// });

paper.project.importSVG('/c.svg', item => {
  const randline = lines[Math.floor(Math.random() * lines.length)];
  const point = randline.getPointAt(Math.random() * randline.length);

  item.position = point;
  item.fillColor = gray;
});

paper.project.importSVG('/piano.svg', item => {
  const randline = lines[Math.floor(Math.random() * lines.length)];
  const point = randline.getPointAt(Math.random() * randline.length);

  item.position = point;
  item.fillColor = gray;
});
