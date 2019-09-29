import Mapbox, { MapboxOptions } from 'mapbox-gl';
import React, { CSSProperties } from 'react';
import { MapContextProvider } from './Context';
import MapLayer from './MapLayer';
import { Lat, Lng } from './types';

interface IMapProps {
  accessToken: string;
  mapContainerId: string;
  style: string;
  center: [Lat, Lng];

  containerStyle?: CSSProperties;
  zoom: number;
}

export default class Map extends MapLayer<IMapProps, {}> {
  public contextValue: any;
  public mapElementContainer: any;
  public mapElement: any;

  componentWillUnmount(): void {
    // Clean up if map un-mounts
    if (this.mapElement) {
      this.mapElement.remove();
    }
  }

  componentDidMount(): void {
    const { zoom, style, center, accessToken, mapContainerId } = this.props;
    (Mapbox as any).accessToken = accessToken;

    // Create mapBox with passed props
    const options: MapboxOptions = {
      center, // Starting position [lng, lat]
      container: mapContainerId, // Container id
      style,
      zoom, // Starting zoom
    };
    const map: Mapbox.Map = new Mapbox.Map(options);
    this.mapElement = map;
    // Set context for map child components
    this.contextValue = {
      container: this.mapElement,
      map: this.mapElement,
    };
    super.componentDidMount();
    // Rerender Map component after MapBox is created to provider MapBox instance in context
    this.forceUpdate();
  }

  // Safe ref to the map container <div/>
  bindMapToContainer = (container: HTMLDivElement) => {
    this.mapElementContainer = container;
  };

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    // ExtractedEventHandlers should be handled by the extended Evented class but for some reason
    // It does not work correctly.
    // Popup component does not appear on the map if this.extractEventHandlers(this.props);
    // Is not called explicitly
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
          {// When context is a available after second render, render children
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
