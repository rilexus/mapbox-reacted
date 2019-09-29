// tslint:disable-next-line:file-name-casing
import React, {
  ComponentClass,
  ComponentType,
  createContext,
  FC,
  forwardRef,
  useContext,
} from 'react';
import { MapContextI } from './types';

const MapContext = createContext<MapContextI>({});
export const MapContextConsumer = MapContext.Consumer;
export const MapContextProvider = MapContext.Provider;

export const useMapContext = () => useContext<MapContextI>(MapContext);

export const withMapContext = <Props, Instance>(
  WrappedComponent: ComponentClass<Props, Instance>
  // TODO: Omit CanvasContext in more efficient way
): ComponentType<Omit<Props, 'mapbox'>> => {
  const WithMapContextComponent = (props: any, ref: any) => (
    <MapContextConsumer>
      {(mapContext: MapContextI) => (
        <WrappedComponent ref={ref} {...props} mapbox={mapContext} />
      )}
    </MapContextConsumer>
  );
  const name =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithMapContextComponent.displayName = `MapComponent(${name})`;
  const Component = forwardRef(WithMapContextComponent);

  return Component;
};
