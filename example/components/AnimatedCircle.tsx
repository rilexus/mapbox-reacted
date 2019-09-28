import React, { useEffect, useState } from "react";
import { Lat, LayerTypes, Lng } from "../../src/types";
import Circle from "../../src/Circle";
import Layer from "../../src/Layer";

export function AnimatedCircle() {
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
    if (count > 100) {
      return;
    }
    const id = setInterval(update, 60);
    return () => {
      clearInterval(id);
    };
  }, [coords, radius]);

  return (
    <Layer
      layerName={"my-circles"}
      type={LayerTypes.Circle}
      circlePaint={{
        "circle-radius": 5,
        "circle-color": "red"
      }}
    >
      <Circle
        coordinates={coords}
        click={(e: any) => {
          console.log("my circle: ", e);
        }}
      />
    </Layer>
  );
}
