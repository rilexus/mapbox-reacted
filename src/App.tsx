import React, { useEffect, useState } from "react";
import { Map } from "./Map";
import Layer from "./Layer";
import Polygon from "./Polygon";
import { MapLayer } from "./MapLayer";
import { Lat, Lng } from "./Types";
import Line from "./Line";
import Circle from "./Circle";

const testPolygon1 = [
  [
    [6.087253, 50.775521],
    [6.090582, 50.775345],
    [6.092471, 50.772224],
    [6.084703, 50.772088],
    [6.084402, 50.774273]
  ]
];

const testPolygon2 = [
  [
    [6.087253, 50.775521],
    [6.090582, 50.775345],
    [6.084703, 50.772088],
    [6.084402, 50.774273]
  ]
];
function MyPol() {
  // const coordinates = [
  //   [
  //     [-67.13734351262877, 45.137451890638886],
  //     [-66.96466, 44.8097],
  //     [-68.03252, 44.3252],
  //     [-69.06, 43.98],
  //     [-70.11617, 43.68405],
  //     [-70.64573401557249, 43.090083319667144],
  //     [-70.75102474636725, 43.08003225358635],
  //     [-70.79761105007827, 43.21973948828747],
  //     [-70.98176001655037, 43.36789581966826],
  //     [-70.94416541205806, 43.46633942318431],
  //     [-71.08482, 45.3052400000002],
  //     [-70.6600225491012, 45.46022288673396],
  //     [-70.30495378282376, 45.914794623389355]
  //   ]
  // ];
  return <Polygon coordinates={testPolygon1} />;
}

const App: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const token =
    "pk.eyJ1Ijoic3RhbmlzMTk5MiIsImEiOiJjam14cXZsMW4xNjQ0M2tydWRjYTdtZnNnIn0.UKGr3I6KmigqCy8cR5ZHZw";
  const center = [6.0839, 50.7753] as [Lat, Lng];

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }, []);

  return (
    <div className="App">
      <Map
        mousemove={() => {
          console.log("app map move");
        }}
        accessToken={token}
        mapContainerId={"map"}
        style={"mapbox://styles/mapbox/streets-v11"}
        center={center}
        zoom={14}
        containerStyle={{
          height: "500px",
          width: "500px"
        }}
      >
        <Layer
          layerName={"testlayer"}
          linePaint={{
            "line-color": "#ed6498",
            "line-width": 5,
            "line-opacity": 0.8
          }}
          circlePaint={{
            "circle-radius": 10,
            "circle-color": "#3887be"
          }}
          fillPaint={{ "fill-color": "#088", "fill-opacity": 0.8 }}
          fillLayout={{ visibility: "visible" }}
        >
          <MyPol />
          <Polygon
            fillPaint={{ "fill-color": "yellow", "fill-opacity": 1 }}
            coordinates={testPolygon2}
            click={() => {
              console.log("click");
            }}
          />
          <Line
            coordinates={[[6.087253, 50.775521], [6.090582, 50.775345]]}
            linePaint={{
              "line-color": "green",
              "line-width": 5,
              "line-opacity": 0.8
            }}
          />
          <Line coordinates={[[6.084703, 50.772088], [6.084402, 50.774273]]} />
          <Circle coordinates={[6.087253, 50.775521]} />
        </Layer>
        <Circle coordinates={[6.087253, 50.775521]} />
      </Map>
    </div>
  );
};

export default App;
