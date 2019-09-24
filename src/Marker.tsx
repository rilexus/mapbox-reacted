import React, { Component } from "react";
import * as MapBox from "mapbox-gl";
import { withMapContext } from "./Context";
import { EventHandler, MapContext } from "./Types";
import { Evented } from "./Evented";

interface MarkerPropsI {
  draggable: boolean;
  lngLat: [number, number];
  dragend: EventHandler;
}

class Marker extends Evented<MarkerPropsI & MapContext, any> {
  marker: MapBox.Marker;

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const {
      draggable,
      mapbox: { map },
      lngLat
    } = this.props;
    const markerOptions = {
      draggable
    };
    const marker = new MapBox.Marker(markerOptions);
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

  render(): null {
    return null;
  }
}

export default withMapContext<MarkerPropsI, any>(Marker);
