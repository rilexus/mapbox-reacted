import React, { CSSProperties } from "react";
import * as MapBox from "mapbox-gl";
import { MapContextProvider } from "./Context";
import { MapboxOptions } from "mapbox-gl";
import { Lat, Lng } from "./Types";
import { MapLayer } from "./MapLayer";

interface MapPropsI {
  accessToken: string;
  mapContainerId: string;
  style: string;
  center: [Lat, Lng];
  containerStyle?: CSSProperties;
  zoom: number;
}
// start at componentDiMount
export class Map extends MapLayer<MapPropsI> {
  contextValue: any;
  mapElementContainer: any;
  mapElement: any;

  componentDidMount(): void {
    const { zoom, style, center, accessToken, mapContainerId } = this.props;
    (MapBox as any).accessToken = accessToken;

    // create mapBox with passed props
    const options: MapboxOptions = {
      container: mapContainerId, // container id
      style: style,
      center: center, // starting position [lng, lat]
      zoom: zoom // starting zoom
    };
    const map: MapBox.Map = new MapBox.Map(options);
    this.mapElement = map;
    // set context for map child components
    this.contextValue = {
      container: this.mapElement,
      map: this.mapElement
    };
    super.componentDidMount();
    // rerender Map component after MapBox is created to provider MapBox instance in context
    this.forceUpdate();
  }

  // safe ref to the map container <div/>
  bindMapToContainer = (container: HTMLDivElement) => {
    this.mapElementContainer = container;
  };

  componentWillUnmount(): void {
    // clean up if map un-mounts
    if (this.mapElement) this.mapElement.remove();
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    // extractedEventHandlers should be handled by the extended Evented class but for some reason
    // it does not work correctly.
    // Popup component does not appear on the map if this.extractEventHandlers(this.props);
    // is not called explicitly
    this.extractedEventHandlers = this.extractEventHandlers(this.props);
    super.componentDidUpdate(prevProps, prevState, snapshot);
    // TODO: handle map props update
    this.mapElement.resize();
  }

  render(): any {
    const { children, mapContainerId, containerStyle } = this.props;
    return (
      <>
        <div
          id={mapContainerId}
          ref={this.bindMapToContainer}
          style={containerStyle ? { ...containerStyle } : {}}
        >
          {// when context is a available after second render, render children
          this.contextValue ? (
            <MapContextProvider value={this.contextValue}>
              {children}
            </MapContextProvider>
          ) : null}
        </div>
      </>
    );
  }
}
