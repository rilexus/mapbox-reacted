import React, {
  ComponentClass,
  ComponentType,
  createContext,
  FC,
  forwardRef,
  useContext
} from "react";
import { MapContext } from "./types";

const _MapContext = createContext<MapContext>({});
export const MapContextConsumer = _MapContext.Consumer;
export const MapContextProvider = _MapContext.Provider;

export const useMapContext = () => useContext<MapContext>(_MapContext);

export const withMapContext = <Props, Instance>(
  WrappedComponent: ComponentClass<Props, Instance>
  // TODO: Omit CanvasContext in more efficient way
): ComponentType<Omit<Props, "map" | "layer">> => {
  const WithMapContextComponent = (props: any, ref: any) => (
    <MapContextConsumer>
      {(mapContext: MapContext) => (
        <WrappedComponent ref={ref} {...props} mapbox={mapContext} />
      )}
    </MapContextConsumer>
  );
  const name =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithMapContextComponent.displayName = `MapComponent(${name})`;
  const Component = forwardRef(WithMapContextComponent);

  return Component;
};
