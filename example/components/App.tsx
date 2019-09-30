import React, { useEffect, useState } from 'react';
import { Lat, LayerTypes, Lng } from '../../src';
import { Map } from '../../src';
import { Popup } from '../../src';
import { Layer } from '../../src';
import { Polygon } from '../../src';
import { LayerSource } from '../../src';
import { AnimatedCircle } from './AnimatedCircle';

const testPolygon2 = [
  [
    [6.0841331, 50.7764869],
    [6.0852489, 50.7762799],
    [6.084809, 50.7755438],
    [6.0837415, 50.77571],
    [6.0841331, 50.7764869],
  ],
];

const App = () => {
  const token =
    'pk.eyJ1Ijoic3RhbmlzMTk5MiIsImEiOiJjam14cXZsMW4xNjQ0M2tydWRjYTdtZnNnIn0.UKGr3I6KmigqCy8cR5ZHZw';
  const style = 'mapbox://styles/stanis1992/ck0l708861x8m1cpqhi1l0p4p';
  const center = [6.0839, 50.7753] as [Lat, Lng];

  const [popup, setPopupData] = useState({
    visible: false,
    coordinates: [6.0839, 50.7753] as [number, number],
  });
  const [windowDimensions, setWindowDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const handleResize = (e: any) => {
    setWindowDimensions({
      height: e.target.innerHeight,
      width: e.target.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const showPopup = (e: any) => {
    const { lngLat } = e;
    const coordinates = [lngLat.lng, lngLat.lat] as [number, number];
    setPopupData({
      coordinates,
      visible: true,
    });
  };
  const hidePopup = () => {
    setPopupData({
      ...popup,
      visible: false,
    });
  };

  return (
    <div>
      <Map
        click={hidePopup}
        accessToken={token}
        mapContainerId={'map'}
        style={style}
        center={center}
        zoom={14}
        containerStyle={{
          height: windowDimensions.height,
          width: windowDimensions.width,
        }}
      >
        <Popup lngLat={[6.0839, 50.7793]}>Map Popup</Popup>

        <LayerSource>
          <Layer
            layerName={'lines'}
            type={LayerTypes.Line}
            linePaint={{
              'line-color': 'red',
              'line-width': 2,
            }}
            filter={['==', '$type', 'Polygon']}
          />
          <Layer
            move={() => {}}
            layerName={'my-poly'}
            type={LayerTypes.Fill}
            fillPaint={{
              'fill-color': '#088',
              'fill-opacity': 0.8,
            }}
            fillLayout={{ visibility: 'visible' }}
          >
            {popup.visible ? (
              <Popup
                lngLat={popup.coordinates}
                open={() => {
                  console.log('pop open');
                }}
                close={e => {
                  // console.log("pop close: ", e);
                }}
              >
                <div>Popup Content</div>
              </Popup>
            ) : null}

            <Polygon
              coordinates={testPolygon2}
              properties={{
                name: 'test-polygon 2',
              }}
              click={showPopup}
              mouseenter={(e: any) => {
                console.log('enter');
              }}
              mouseover={(e: any) => {}}
            />
          </Layer>
          <Layer
            layerName={'my-circles'}
            type={LayerTypes.Circle}
            circlePaint={{
              'circle-radius': 5,
              'circle-color': 'red',
            }}
          >
            <AnimatedCircle />
          </Layer>
        </LayerSource>
      </Map>
      some
    </div>
  );
};

export default App;
