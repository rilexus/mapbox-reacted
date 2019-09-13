import React, { useEffect, useState } from "react";
import { Map } from "./Map";
import Layer from "./Layer";
import Polygon from "./Polygon";
import { MapLayer } from "./MapLayer";

function MyPol() {
  const coordinates = [
    [
      [-67.13734351262877, 45.137451890638886],
      [-66.96466, 44.8097],
      [-68.03252, 44.3252],
      [-69.06, 43.98],
      [-70.11617, 43.68405],
      [-70.64573401557249, 43.090083319667144],
      [-70.75102474636725, 43.08003225358635],
      [-70.79761105007827, 43.21973948828747],
      [-70.98176001655037, 43.36789581966826],
      [-70.94416541205806, 43.46633942318431],
      [-71.08482, 45.3052400000002],
      [-70.6600225491012, 45.46022288673396],
      [-70.30495378282376, 45.914794623389355]
    ]
  ];
  return <Polygon coordinates={coordinates} />;
}

const App: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const token =
    "pk.eyJ1Ijoic3RhbmlzMTk5MiIsImEiOiJjam14cXZsMW4xNjQ0M2tydWRjYTdtZnNnIn0.UKGr3I6KmigqCy8cR5ZHZw";
  const center = [-76.53063297271729, 39.18174077994108] as [number, number];

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 5000);
  }, []);

  const coordinates = [
    [
      [-67.13734351262877, 45.137451890638886],
      [-66.96466, 44.8097],
      [-68.03252, 44.3252],
      [-69.06, 43.98],
      [-70.11617, 43.68405],
      [-70.64573401557249, 43.090083319667144],
      [-70.75102474636725, 43.08003225358635],
      [-70.79761105007827, 43.21973948828747],
      [-70.98176001655037, 43.36789581966826],
      [-70.94416541205806, 43.46633942318431],
      [-71.08482, 45.3052400000002],
      [-70.6600225491012, 45.46022288673396],
      [-70.30495378282376, 45.914794623389355],
      [-70.00014034695016, 46.69317088478567],
      [-69.23708614772835, 47.44777598732787],
      [-68.90478084987546, 47.184794623394396],
      [-68.23430497910454, 47.35462921812177],
      [-67.79035274928509, 47.066248887716995],
      [-67.79141211614706, 45.702585354182816],
      [-67.13734351262877, 45.137451890638886]
    ]
  ];

  return (
    <div className="App">
      <Map
        accessToken={token}
        mapContainerId={"map"}
        style={"mapbox://styles/mapbox/streets-v11"}
        center={center}
      >
        {visible ? (
          <Layer layerName={'testlayer'}>
            <MyPol />
            <Polygon coordinates={coordinates} />
          </Layer>
        ) : null}
      </Map>
    </div>
  );
};

export default App;
