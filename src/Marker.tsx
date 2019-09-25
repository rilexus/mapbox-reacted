import React from "react";
import * as MapBox from "mapbox-gl";
import ReactDOM from "react-dom";
import { withMapContext } from "./Context";
import { EventHandler, MapContext } from "./Types";
import { Evented } from "./Evented";

interface MarkerEvents {
  dragend?: EventHandler;
  click?: EventHandler;
  dragStart?: EventHandler;
  drag?: EventHandler;
  mouseover?: EventHandler;
  mouseenter?: EventHandler;
  mouseleave?: EventHandler;
}

interface MarkerPropsI extends MarkerEvents {
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
}

class Marker extends Evented<MarkerPropsI & MapContext, any> {
  marker: MapBox.Marker;
  markerContainer: any = null;
  componentContainer: any;

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
    // set mapElement to marker => event handle functions passed to this component
    // will be attached to the marker instance by the Evented class
    this.mapElement = marker;

    if (map) {
      this.marker.setLngLat(lngLat).addTo(map);
    }

    super.componentDidMount();
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
    const { lngLat: nextLngLat } = this.props;
    const { lngLat: prevLngLat } = prevProps;
    // update marker position if lngLat ref changed
    if (nextLngLat !== prevLngLat) {
      this.marker.setLngLat(nextLngLat);
    }

    super.componentDidUpdate(prevProps, prevState, snapshot);
  }

  componentWillUnmount(): void {
    // remove marker from map instance if marker unmounts
    this.marker.remove();
    ReactDOM.unmountComponentAtNode(this.componentContainer);
    super.componentWillUnmount();
  }

  bindComponentContainer = (el: any) => {
    this.componentContainer = el;
  };

  bindMarkerContainerElement = (el: any) => {
    this.markerContainer = el;
  };

  render(): any {
    const { children } = this.props;
    if (!children) return null;
    // if children are passed to marker render children else the default Mapbox marker will be rendered
    return (
      <span
        ref={this.bindComponentContainer}
        onClick={e => this.fireEvent("click", e)}
        onMouseOver={e => this.fireEvent("mouseover", e)}
        onMouseEnter={e => this.fireEvent("mouseenter", e)}
        onMouseLeave={e => this.fireEvent("mouseleave", e)}
      >
        <span ref={this.bindMarkerContainerElement}>{children}</span>
      </span>
    );
  }
}

export default withMapContext<MarkerPropsI, any>(Marker);
