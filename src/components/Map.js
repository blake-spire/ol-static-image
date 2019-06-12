import Map from "ol/Map.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";
import ImageLayer from "ol/layer/Image.js";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";

const loadImage = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.addEventListener("load", () => {
      return resolve(img);
    });

    img.addEventListener("error", () => {
      return reject("cannot load image");
    });

    img.src = src;
  });
};

const getImageDimensions = img => {
  const container = document.querySelector(".map");
  const imageAspectRatio = img.naturalWidth / img.naturalHeight;
  const canvasAspectRatio = container.offsetWidth / container.offsetHeight;
  const renderableWidth =
    imageAspectRatio < canvasAspectRatio
      ? img.naturalWidth * (container.offsetHeight / img.naturalHeight)
      : container.offsetWidth;
  const renderableHeight =
    imageAspectRatio > canvasAspectRatio
      ? img.naturalHeight * (container.offsetWidth / img.naturalWidth)
      : container.offsetHeight;

  return {
    width: renderableWidth,
    height: renderableHeight,
  };
};

loadImage("https://imgs.xkcd.com/comics/online_communities.png").then(img => {
  const { width, height } = getImageDimensions(img);
  const extent = [0, 0, width, height];
  const projection = new Projection({
    extent,
    units: "pixels",
    code: new Date().toString(),
  });

  new Map({
    target: "map",
    view: new View({
      projection,
      center: getCenter(extent),
      maxResolution: 2,
      minResolution: 0.25,
      resolution: 1,
    }),
    layers: [
      new ImageLayer({
        source: new Static({
          projection,
          imageExtent: extent,
          url: img.src,
        }),
      }),
    ],
  });
});

const Map = props => {
  return (
    <section className="map">
      <div id="map" />
    </section>
  );
};

export default Map;
