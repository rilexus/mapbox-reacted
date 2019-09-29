import React from 'react';
import * as MapBox from 'mapbox-gl';
import ReactDOM from 'react-dom';
import { withMapContext } from './Context';
import { EventHandler, IMapContext } from './Types';
import Evented from './Evented';

interface IMarkerEvents {
  dragend?: EventHandler;
  click?: EventHandler;
  dragStart?: EventHandler;
  drag?: EventHandler;
  mouseover?: EventHandler;
  mouseenter?: EventHandler;
  mouseleave?: EventHandler;
}

interface IMarkerPropsI extends IMarkerEvents {
  options: {
    draggable: boolean;
    color?: string;
    anchor?:
      | 'center'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    offset?: [number, number];
  };

  lngLat: [number, number];
}

class Marker extends Evented<IMarkerPropsI & IMapContext, any> {
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
      children,
    } = this.props;

    const marker = new MapBox.Marker({
      ...options,
      element: this.markerContainer,
    });
    this.marker = marker;
    // Set mapElement to marker => event handle functions passed to this component
    // Will be attached to the marker instance by the Evented class
    this.mapElement = marker;

    if (map) {
      this.marker.setLngLat(lngLat).addTo(map);
    }

    super.componentDidMount();
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
    const { lngLat: nextLngLat } = this.props;
    const { lngLat: prevLngLat } = prevProps;
    // Update marker position if lngLat ref changed
    if (nextLngLat !== prevLngLat) {
      this.marker.setLngLat(nextLngLat);
    }

    super.componentDidUpdate(prevProps, prevState, snapshot);
  }

  componentWillUnmount(): void {
    // Remove marker from map instance if marker unmounts
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
    if (!children) {
      return null;
    }
    // If children are passed to marker render children else the default Mapbox marker will be rendered
    return (
      <span
        ref={this.bindComponentContainer}
        onClick={e => this.fireEvent('click', e)}
        onMouseOver={e => this.fireEvent('mouseover', e)}
        onMouseEnter={e => this.fireEvent('mouseenter', e)}
        onMouseLeave={e => this.fireEvent('mouseleave', e)}
      >
        <span ref={this.bindMarkerContainerElement}>{children}</span>
      </span>
    );
  }
}

export default withMapContext<IMarkerPropsI, any>(Marker);
