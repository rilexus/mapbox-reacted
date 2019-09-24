import React, { useEffect, useState } from "react";
import { Map } from "./Map";
import Layer from "./Layer";
import Polygon from "./Polygon";
import { Lat, LayerTypes, Lng } from "./Types";
import Line from "./Line";
import Circle from "./Circle";
import GeoJSONSource from "./GeoJSONSource";
import Popup from "./Popup";

const testPolygon1 = [
  [
    [6.0825666, 50.7763105],
    [6.0820517, 50.7755608],
    [6.0836127, 50.775381],
    [6.0835805, 50.7760391],
    [6.0831675, 50.776531],
    [6.0825666, 50.7763105]
  ]
];

const testPolygon2 = [
  [
    [6.0841331, 50.7764869],
    [6.0852489, 50.7762799],
    [6.084809, 50.7755438],
    [6.0837415, 50.77571],
    [6.0841331, 50.7764869]
  ]
];

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
      click={e => {
        console.log("my circle: ", e);
      }}
    />
  );
}
const PopupContent = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // popup content update test
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [count]);
  return <span>Polygon_{count}</span>;
};

const App: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [popup, setPopupData] = useState({
    visible: false,
    coordinates: [6.0839, 50.7753] as [number, number]
  });
  const token =
    "pk.eyJ1Ijoic3RhbmlzMTk5MiIsImEiOiJjam14cXZsMW4xNjQ0M2tydWRjYTdtZnNnIn0.UKGr3I6KmigqCy8cR5ZHZw";
  const center = [6.0839, 50.7753] as [Lat, Lng];
  const style = "mapbox://styles/stanis1992/ck0l708861x8m1cpqhi1l0p4p";
  // const style = "mapbox://styles/mapbox/dark-v10";
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }, []);

  const showPopup = (at: [number, number]) => {
    setPopupData({
      visible: true,
      coordinates: at
    });
  };
  const hidePopup = () => {
    setPopupData({
      ...popup,
      visible: false
    });
  };

  return (
    <div className="App">
      <Map
        mousemove={() => {}}
        move={() => {}}
        click={hidePopup}
        accessToken={token}
        mapContainerId={"map"}
        style={style}
        center={center}
        zoom={14}
        containerStyle={{
          height: window.innerHeight,
          width: window.innerWidth
        }}
      >
        <Popup lngLat={[6.0839, 50.7793]}>Map</Popup>

        <GeoJSONSource>
          <Layer
            click={(e: any) => {}}
            move={() => {}}
            layerName={"my-poly"}
            type={LayerTypes.Fill}
            fillPaint={{ color: "#088", opacity: 0.8 }}
            fillLayout={{ visibility: "visible" }}
          >
            {popup.visible ? (
              <Popup
                lngLat={popup.coordinates}
                open={() => {
                  console.log("pop open");
                }}
                close={e => {
                  // console.log("pop close: ", e);
                }}
              >
                <PopupContent />
              </Popup>
            ) : null}
            <Polygon
              coordinates={testPolygon2}
              properties={{
                name: "testpily 2"
              }}
              mouseover={e => {
                // console.log("over", e.lngLat);
              }}
              click={e => {
                console.log("poly 2");
                showPopup([e.lngLat.lng, e.lngLat.lat]);
              }}
            />
            <Polygon
              coordinates={testPolygon1}
              properties={{
                name: "testpily 1"
              }}
              click={e => {
                console.log("poly 1");
                showPopup([e.lngLat.lng, e.lngLat.lat]);
              }}
            />
          </Layer>

          <Layer
            layerName={"my-circles"}
            type={LayerTypes.Circle}
            circlePaint={{
              radius: 5,
              color: "green"
            }}
          >
            <MyCircle />
          </Layer>
          <Layer
            layerName={"my-line"}
            type={LayerTypes.Line}
            linePaint={{
              color: "#ed6498",
              width: 5,
              opacity: 0.8
            }}
          >
            <Line
              click={e => {
                console.log("line: ", e);
              }}
              coordinates={[[6.087253, 50.775521], [6.090582, 50.775345]]}
            />
            <Line
              coordinates={[[6.084703, 50.772088], [6.084402, 50.774273]]}
            />
          </Layer>
        </GeoJSONSource>
      </Map>
    </div>
  );
};

export default App;
