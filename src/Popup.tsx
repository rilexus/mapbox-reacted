import React, { Component } from "react";
import * as MapBox from "mapbox-gl";
import { withMapContext } from "./Context";
import { EventHandler, MapContext } from "./Types";
import { LngLatLike } from "mapbox-gl";
import uuid from "uuid";

interface PopupPropsI {
  lngLat: LngLatLike;
  open?: EventHandler;
  close?: EventHandler;
}

class Popup extends Component<PopupPropsI & MapContext, any> {
  popup: MapBox.Popup;
  lngLatBounds: MapBox.LngLatBounds;
  popupContainer: any;
  static displayName = "Popup";

  constructor(props: any) {
    super(props);
    const {
      mapbox: { map },
      lngLat
    } = this.props;

    this.state = {
      popupID: `popup-${uuid()}`
    };

    const popupOptions = { closeButton: false, closeOnClick: false };
    this.popup = new MapBox.Popup(popupOptions).setLngLat(lngLat).addTo(map);
    if (this.props.close) {
      this.popup.on("close", this.props.close);
    }
    if (this.props.open) {
      this.popup.on("open", this.props.open);
    }
  }

  bindPopupToContainer = (el: any) => {
    if (el) this.popupContainer = el;
  };

  componentDidMount(): void {
    if (this.popupContainer) {
      this.popup.setDOMContent(this.popupContainer);
    }
  }
  componentDidUpdate(
    prevProps: Readonly<PopupPropsI & MapContext>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    this.popup.setLngLat(this.props.lngLat);
  }

  componentWillUnmount(): void {
    if (this.popup) {
      if (this.props.open) {
        this.popup.off("open", this.props.open);
      }
      if (this.props.close) {
        this.popup.off("close", this.props.close);
      }
      console.log("pop unmount");

      this.popup.remove();
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div id={this.state.popupID} ref={this.bindPopupToContainer}>
        {children}
      </div>
    );
  }
}

export default withMapContext(Popup);
