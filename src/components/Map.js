import React from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { getCenter } from "ol/extent.js";
import ImageLayer from "ol/layer/Image.js";
import Projection from "ol/proj/Projection.js";
import Static from "ol/source/ImageStatic.js";

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  loadImage = src => {
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

  getImageDimensions = img => {
    const {
      offsetHeight: containerHeight,
      offsetWidth: containerWidth,
    } = this.mapRef.current;

    const containerAspectRatio = containerWidth / containerHeight;
    const imageAspectRatio = img.naturalWidth / img.naturalHeight;
    const width =
      imageAspectRatio < containerAspectRatio
        ? img.naturalWidth * (containerHeight / img.naturalHeight)
        : containerWidth;
    const height =
      imageAspectRatio > containerAspectRatio
        ? img.naturalHeight * (containerWidth / img.naturalWidth)
        : containerHeight;

    // safety check
    return {
      width: width > 0 ? width : img.naturalWidth,
      height: height > 0 ? height : img.naturalHeight,
    };
  };

  componentDidMount() {
    this.loadImage("https://imgs.xkcd.com/comics/online_communities.png").then(
      img => {
        const { width, height } = this.getImageDimensions(img);
        console.log(width, height);

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
      }
    );
  }

  render() {
    return (
      <section className="map">
        <div id="map" ref={this.mapRef} />
      </section>
    );
  }
}

export default MapComponent;
