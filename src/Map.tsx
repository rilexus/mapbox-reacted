import React, { Component, CSSProperties } from "react";
import * as MapBox from "mapbox-gl";
import { MapContextProvider } from "./Context";
import { MapboxOptions } from "mapbox-gl";
import { Lat, Lng } from "./Types";
import { Evented } from "./Evented";

interface OwnProps {
  accessToken: string;
  mapContainerId: string;
  style: string;
  center: [Lat, Lng];
  containerStyle?: CSSProperties;
  zoom: number;
}
// start at componentDiMount
export class Map extends Evented<OwnProps, any> {
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
    const map = new MapBox.Map(options);
    this.mapElement = map;
    this.bindEventProps(this.mapElement);
    // set context for child map components
    this.contextValue = {
      container: this.mapElement,
      map: this.mapElement
    };
    // rerender Map component after MapBox is created to provider MapBox instance in context
    super.componentDidMount();

    this.forceUpdate();
    // see bindMapToContainer function
  }

  // safe ref to the map container <div/>
  bindMapToContainer = (container: HTMLDivElement) => {
    this.mapElementContainer = container;
  };

  componentWillUnmount(): void {
    // clean up if map un-mounts
    if (this.mapElement) this.mapElement.remove();
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
