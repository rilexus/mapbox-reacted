import React, { Component } from "react";
import { MapContextProvider, withMapContext } from "./Context";
import GeoJSONSource from "./LayerGroup";

import uuid from "uuid";
import {
  BackgroundLayout,
  BackgroundPaint,
  FillExtrusionLayout,
  FillExtrusionPaint,
  RasterLayout,
  RasterPaint,
  SymbolLayout,
  SymbolPaint,
  HeatmapLayout,
  HeatmapPaint,
  HillshadeLayout,
  HillshadePaint,
  GeoJSONSource as MapboxGeoJSONSource
} from "mapbox-gl";
import {
  CircleLayout,
  CirclePaint,
  EventHandler,
  EventsObject,
  EventType,
  FeatureTypes,
  FillLayout,
  FillPaint,
  LayerTypes,
  LineLayout,
  LinePaint,
  MapContext
} from "./Types";
import { StyleUtils } from "./utils";
import { MapLayer } from "./MapLayer";

interface LayerStateI {
  layerID: string;
}

interface LayerProps {
  layerName: string;

  circlePaint?: CirclePaint;
  circleLayout?: CircleLayout;

  fillPaint?: FillPaint;
  fillLayout?: FillLayout;

  linePaint?: LinePaint;
  lineLayout?: LineLayout;

  type: LayerTypes;
  filter?: string[];
}

export type FeatureStyle = {
  paint?:
    | BackgroundPaint
    | FillExtrusionPaint
    | SymbolPaint
    | RasterPaint
    | HeatmapPaint
    | FillPaint
    | LinePaint
    | CirclePaint
    | HillshadePaint
    | any;
  layout?:
    | BackgroundLayout
    | FillLayout
    | FillExtrusionLayout
    | LineLayout
    | SymbolLayout
    | RasterLayout
    | CircleLayout
    | HeatmapLayout
    | HillshadeLayout;
};

/**
 * @desc Manages passed Feature child components: Polygon, Line, Circle etc.
 * Feature child component uses passed functions through context: addFeature, removeFeature etc to add itself to the layers data source
 * NOTE: currently layers for children with own style are not removed if the child unmounts. This can cause performance issues!
 */
class Layer extends MapLayer {
  contextValue: any;
  constructor(props: any) {
    super(props);
    this.state = {};
    // adds passed geojson feature to data source
    this.addFeature = this.addFeature.bind(this);
    // removes passed feature from data source
    this.removeFeature = this.removeFeature.bind(this);
    // creates layers of various types for passed feature children with out own style
    // provides context to own children. see Feature Component
    this.init = this.init.bind(this);
    // (helper function) updates layer paint and layout style
    // is used when own childs paint and/or layer updates
    this.updateLayerStyle = this.updateLayerStyle.bind(this);
    // updates feature coordinates, paint, layout
    this.updateFeature = this.updateFeature.bind(this);

    // if like to know hoe this class works, start at the componentDidMount function
  }

  /**
   * @desc Adds passed feature to Layer data source. If a style or eventsObject prop is given, it add a new/unique layer for this feature.
   * @param newFeature
   * @param style
   */
  addFeature(newFeature: any): void {
    const {
      mapbox: {
        container: { getFeatures, setFeatures }
      }
    } = this.props;
    const oldFeatures = getFeatures();
    setFeatures([...oldFeatures, newFeature]);
    this.forceUpdate();
  }

  removeFeature(id: string): void {
    const {
      mapbox: {
        container: { removeFeatures }
      }
    } = this.props;
    removeFeatures([id]);
  }
  /**
   * @desc Creates layer attached to a source and passes own context to the children
   */
  init() {
    const {
      fillPaint,
      fillLayout,
      circlePaint,
      circleLayout,
      linePaint,
      filter,
      mapbox: {
        container: { source },
        map
      },
      layerName,
      type
    } = this.props;
    if (map && source) {
      const layerID = `${layerName}-${uuid()}`;
      const sourceID = source.id;

      this.setState(
        (curState: LayerStateI) => {
          return {
            ...curState,
            layerID: layerID
          };
        },
        () => {
          let paint = {};
          let layout = {};
          let _filter: string[] = [""];

          if (type === LayerTypes.Fill) {
            paint = StyleUtils.transformFillPaint(fillPaint);
            layout = StyleUtils.transformFillPaint(fillLayout);
            _filter = ["==", "$type", "Polygon"];
          }
          if (type === LayerTypes.Circle) {
            paint = StyleUtils.transformCirclePaint(circlePaint);
            _filter = ["==", "$type", "Point"];
          }
          if (type === LayerTypes.Line) {
            paint = StyleUtils.transformLinePaint(linePaint);
            _filter = ["==", "$type", "LineString"];
          }

          const layerOptions = {
            id: layerID,
            type: type,
            source: sourceID,
            paint: paint,
            layout: layout,
            filter: filter || _filter
          };
          map.addLayer(layerOptions);
          const layer = map.getLayer(layerID);

          console.log(this.extractedEventHandlers);

          Object.entries(this.extractedEventHandlers).forEach(
            ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
              map.on(eventType, layerID, eventHandleFunction);
            }
          );

          this.contextValue = {
            ...this.props.mapbox,
            layer: {
              layer,
              addFeature: this.addFeature,
              updateFeature: this.updateFeature,
              removeFeature: this.removeFeature
            }
          };

          this.forceUpdate();
        }
      );
    }
  }

  updateLayerStyle(layerID: string, paint?: any, layout?: any) {
    const {
      mapbox: { map }
    } = this.props;

    if (paint) {
      Object.entries(paint).forEach(([paintProperty, paintValue]) => {
        // https://docs.mapbox.com/mapbox-gl-js/api/#map#setpaintproperty
        map.setPaintProperty(layerID, paintProperty, paintValue);
      });
    }
    if (layout) {
      Object.entries(layout).forEach(([layoutProperty, layoutValue]) => {
        // https://docs.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
        map.setLayoutProperty(layerID, layoutProperty, layoutValue);
      });
    }
  }

  /**
   * Updates features coordinates and style
   * @param featureID - Unique feature id (__id) see Feature component
   * @param coordinates - Feature coordinate
   * @param properties - Feature properties
   */
  updateFeature(featureID: string, coordinates: any, properties: any): void {
    const {
      mapbox: {
        container: { getFeatures, setFeatures }
      }
    } = this.props;

    const oldFeatures = getFeatures();

    const newFeatures = oldFeatures.map((feature: any) => {
      const { __id } = feature.properties;
      if (__id === featureID) {
        feature.geometry.coordinates = [...coordinates];
        feature.properties = { ...properties };
      }
      return feature;
    });
    setFeatures(newFeatures);
  }

  componentDidMount(): void {
    this.init();
  }

  componentWillUnmount(): void {
    const {
      mapbox: { map }
    } = this.props;
    try {
      const { layerID } = this.state;
      if (layerID) {
        map.removeLayer(layerID);
      }
    } catch (e) {
      console.error(e);
    }
  }
  // render(): any {
  //   const { children } = this.props;
  //   if (children === null) return null;
  //   if (this.contextValue) {
  //     return (
  //       <MapContextProvider value={this.contextValue}>
  //         {children}
  //       </MapContextProvider>
  //     );
  //   }
  //   return <>{children}</>;
  // }
}

// make map context available in this component
export default withMapContext(Layer);
