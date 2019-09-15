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
  return <Polygon coordinates={testPolygon1} />;
}

function MyCircle() {
  const [coords, setCoords] = useState<any>([6.087253, 50.775521]);
  const [radius, setRadius] = useState(6);

  const [count, setCount] = useState(0);

  function update() {
    setCount(count + 1);

    const newCoords: [Lng, Lat] = [...coords] as [Lng, Lat];
    const lng = newCoords[0];
    const lat = newCoords[1];
    setCoords([lng + 0.0001, lat]);
    setRadius(radius + 1);
  }

  useEffect(() => {
    if (count > 2) {
      return;
    }
    const id = setInterval(update, 500);
    return () => {
      clearInterval(id);
    };
  }, [coords, radius]);

  return (
    <Circle
      coordinates={coords}
      paint={{
        radius: radius,
        color: "red"
      }}
    />
  );
}
function Count() {
  const [count, setCount] = useState(-1);
  const [id, setId] = useState(-1);
  function update() {
    setCount(count + 1);
  }

  console.log(count);
  useEffect(() => {
    const id = setInterval(update, 500);
    return () => {
      clearInterval(id);
    };
  }, [count]);

  return <div></div>;
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
            color: "#ed6498",
            width: 5,
            opacity: 0.8
          }}
          circlePaint={{
            radius: 5,
            color: "green"
          }}
          fillPaint={{ color: "#088", opacity: 0.8 }}
          fillLayout={{ visibility: "visible" }}
        >
          {/*<MyPol />*/}
          <MyCircle />
          <Polygon
            paint={{ color: "yellow", opacity: 1, opacityTransition: {} }}
            coordinates={testPolygon2}
            // click={() => {
            //   console.log("click");
            // }}
          />
          <Circle coordinates={[6.087253, 50.776521]} />
          <Line
            coordinates={[[6.087253, 50.775521], [6.090582, 50.775345]]}
            paint={{
              color: "green",
              width: 5,
              opacity: 0.8
            }}
          />
          <Line coordinates={[[6.084703, 50.772088], [6.084402, 50.774273]]} />
        </Layer>
      </Map>
    </div>
  );
};

export default App;
