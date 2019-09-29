import React from 'react';
import uuid from 'uuid';
import { EventHandler, EventType, FeatureTypes } from './types';
import MapLayer from './MapLayer';

export interface IFeatureProps {
  coordinates: any;
  properties?: { [key: string]: any };
}
interface IFeatureStateI {
  __id: string;
}
export default class Feature<P, State> extends MapLayer<P, State> {
  featureType: FeatureTypes;

  constructor(props: any) {
    super(props);
    this.bindEventsToFeature = this.bindEventsToFeature.bind(this);
    this.addFeature = this.addFeature.bind(this);

    this.bindEventsToFeature();
  }

  addFeature(geometry: GeoJSON.Geometry, properties: any) {
    const {
      mapbox: { layer, map },
    } = this.props;

    if (layer) {
      const id = uuid();
      // Save unique id for the feature
      this.setState(
        (state: IFeatureStateI) => ({
          ...state,
          __id: id,
        }),
        () => {
          const feature = {
            geometry: {
              ...geometry,
            },
            properties: {
              ...properties,
              __id: id,
            },
            type: 'Feature',
          };
          layer.addFeature(feature);

          this.contextValue = {
            ...this.props.mapbox,
            feature: {
              geometry,
              properties: {
                ...properties,
                __id: id,
              },
            },
          };
          this.forceUpdate();
        }
      );
    }
  }

  bindEventsToFeature() {
    // NOTE: EventHandlers are attached to a whole map layer not a specific feature by default.
    // See: https://docs.mapbox.com/mapbox-gl-js/example/popup-on-click/
    // Every feature event handler is called on a map event
    // And need to be filtered to distinguish the fired event to a specific feature.
    const {
      mapbox: { layer, map },
    } = this.props;

    this.extractedEventHandlers = Object.entries(
      this.extractedEventHandlers
    ).reduce((acc, [eventType, eventHandler]) => {
      const eventFilter = (e: any) => {
        const { __id } = this.state;

        // If the feature __id in the fired event is same as the current feature __id
        // The event will be passed(filtered) along, else dont.
        if (e && e.features && e.features[0].properties.__id === __id) {
          eventHandler(e);
        }
      };
      return {
        ...acc,
        [eventType]: eventFilter,
      };
    }, {});
    if (layer) {
      Object.entries(this.extractedEventHandlers).forEach(
        ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
          map.on(eventType, layer.layer.id, eventHandleFunction);
        }
      );
    }
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    const {
      mapbox: { layer, map },
      coordinates,
      properties,
    } = this.props;
    if (layer) {
      layer.updateFeature(this.state.__id, coordinates, {
        ...properties,
        __id: this.state.__id,
      });
    }
  }

  componentDidMount(): void {
    const {
      mapbox: { map, layer },
    } = this.props;

    super.componentDidMount();
  }

  componentWillUnmount(): void {
    const {
      mapbox: { layer, map },
    } = this.props;
    if (layer) {
      Object.entries(this.extractedEventHandlers).forEach(
        ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
          map.off(eventType, layer.layer.id, eventHandleFunction);
        }
      );
      layer.removeFeature(this.state.__id);
    }
  }
}
