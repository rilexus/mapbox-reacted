import React, {
  ComponentClass,
  ComponentType,
  createContext,
  forwardRef,
  useContext,
} from 'react';
import { IMapContext } from './types';

const MapContext = createContext<IMapContext>({});
export const MapContextConsumer = MapContext.Consumer;
export const MapContextProvider = MapContext.Provider;

export const useMapContext = () => useContext<IMapContext>(MapContext);

export const withMapContext = <Props, Instance>(
  WrappedComponent: ComponentClass<Props, Instance>
  // TODO: Omit CanvasContext in more efficient way
): ComponentType<Omit<Props, 'mapbox'>> => {
  const WithMapContextComponent = (props: any, ref: any) => (
    <MapContextConsumer>
      {(mapContext: IMapContext) => (
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
