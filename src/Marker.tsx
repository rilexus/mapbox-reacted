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
    this.mapElement = marker;

    if (map) {
      this.marker.setLngLat(lngLat).addTo(map);
    }
    this.bindEvents();
  }

  componentWillUnmount(): void {
    this.unbindEvents();
    this.marker.remove();
    ReactDOM.unmountComponentAtNode(this.componentContainer);
    super.componentWillUnmount();
  }

  bindMarkerContainerElement = (el: any) => {
    this.markerContainer = el;
  };

  bindComponentContainer = (el: any) => {
    this.componentContainer = el;
  };

  render(): any {
    const { children, click, mouseover, mouseleave, mouseenter } = this.props;
    if (!children) return null;
    return (
      <span
        ref={this.bindComponentContainer}
        onClick={click ? click : null}
        onMouseOver={mouseover ? mouseover : null}
        onMouseEnter={mouseenter ? mouseenter : null}
        onMouseLeave={mouseleave ? mouseleave : null}
      >
        <span ref={this.bindMarkerContainerElement}>{children}</span>
      </span>
    );
  }
}

export default withMapContext<MarkerPropsI, any>(Marker);
