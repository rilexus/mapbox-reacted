import React, { Component } from "react";
import * as MapBox from "mapbox-gl";
import { withMapContext } from "./Context";
import { EventHandler, MapContext } from "./Types";
import { Evented } from "./Evented";

interface MarkerPropsI {
  options: {
    draggable: boolean;
    color?: string;
    anchor?:
      | "center"
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right";
    offset?: [number, number];
  };

  lngLat: [number, number];
  dragend: EventHandler;
}

class Marker extends Evented<MarkerPropsI & MapContext, any> {
  marker: MapBox.Marker;
  markerContainer: any = null;

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const {
      options,
      mapbox: { map },
      lngLat,
      children
    } = this.props;

    const marker = new MapBox.Marker({
      ...options,
      element: this.markerContainer
    });
    this.marker = marker;
    this.mapElement = marker;

    if (map) {
      this.marker.setLngLat(lngLat).addTo(map);
    }
    this.bindEvents();
  }

  componentWillUnmount(): void {
    this.unbindEvents();
    this.marker.remove();
    super.componentWillUnmount();
  }

  bindMarkerContainerElement = (el: any) => {
    this.markerContainer = el;
  };

  render(): any {
    const { children } = this.props;
    if (!children) return null;
    return <span ref={this.bindMarkerContainerElement}>{children}</span>;
  }
}

export default withMapContext<MarkerPropsI, any>(Marker);
