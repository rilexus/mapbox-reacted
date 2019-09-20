import React from "react";
import { withMapContext } from "./Context";
import GeoJSONDataSource from "./GeoJSONDataSource";

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
  GeoJSONSource
} from "mapbox-gl";
import {
  CircleLayout,
  CirclePaint,
  EventsObject,
  FeatureTypes,
  FillLayout,
  FillPaint,
  LineLayout,
  LinePaint
} from "./Types";
import { StyleUtils } from "./utils";

interface LayerStateI {
  features: any[];
  layerIDs: string[];
  sourceID: string;
}

interface LayerProps {
  layerName?: string;

  circlePaint?: CirclePaint;
  circleLayout?: CircleLayout;

  fillPaint?: FillPaint;
  fillLayout?: FillLayout;

  linePaint?: LinePaint;
  lineLayout?: LineLayout;
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
class Layer extends GeoJSONDataSource<LayerProps, LayerStateI> {
  contextValue: any;
  constructor(props: any) {
    super(props);
    // adds passed geojson feature to data source
    this.addFeature = this.addFeature.bind(this);
    // removes passed feature from data source
    this.removeFeature = this.removeFeature.bind(this);
    // adds layer of type "fill" to the map
    this.addFillLayer = this.addFillLayer.bind(this);
    // adds layer of type point to the map
    this.addCircleLayer = this.addCircleLayer.bind(this);
    // adds layer of type line to the map
    this.addLineLayer = this.addLineLayer.bind(this);
    // removes layer on componentWillUnmount
    this.removeLayer = this.removeLayer.bind(this);
    this.removeAllLayers = this.removeAllLayers.bind(this);
    // creates layers of various types for passed feature children with out own style
    // provides context to own children. see Feature Component
    this.init = this.init.bind(this);
    // (helper function) updates layer paint and layout style
    // is used when own childs paint and/or layer updates
    this.updateLayerStyle = this.updateLayerStyle.bind(this);
    // (helper function) updates feature (child: circle, line etc..) style
    this.updateFeatureStyle = this.updateFeatureStyle.bind(this);
    // updates feature coordinates, paint, layout
    this.updateFeature = this.updateFeature.bind(this);

    // if like to know hoe this class works, start at the componentDidMount function
  }

  /**
   * @desc Adds passed feature to Layer data source. If a style or eventsObject prop is given, it add a new/unique layer for this feature.
   * @param newFeature
   * @param style
   */
  addFeature(
    newFeature: any,
    style?: FeatureStyle,
    eventHandlers?: EventsObject
  ): void {
    const { type } = newFeature.geometry;
    const { _id } = newFeature.properties;
    const { paint, layout } = style;

    if (paint || layout || eventHandlers) {
      const sourceID = this.getSource().id;
      const filterByID = ["==", "_id", `${_id}`];
      switch (type) {
        case FeatureTypes.Polygon:
          this.addFillLayer(
            sourceID,
            (paint as FillPaint) ||
              StyleUtils.transformFillPaint(this.props.fillPaint),
            layout,
            filterByID,
            eventHandlers
          );
          break;
        case FeatureTypes.Point: {
          this.addCircleLayer(
            sourceID,
            (paint as CirclePaint) ||
              StyleUtils.transformCirclePaint(this.props.circlePaint),
            layout,
            filterByID,
            eventHandlers
          );
          break;
        }
        case FeatureTypes.LineString: {
          this.addLineLayer(
            sourceID,
            (paint as LinePaint) ||
              StyleUtils.transformLinePaint(this.props.linePaint),
            layout || StyleUtils.transformLinePaint(this.props.lineLayout),
            filterByID,
            eventHandlers
          );
          break;
        }
      }
    }

    const oldFeatures = this.getFeatures();
    this.setFeatures([...oldFeatures, newFeature]);
  }

  removeFeature(id: string): void {
    const features = this.getFeatures();
    const newFeatures = features.filter(({ properties }: any) => {
      return properties._id !== id;
    });
    this.setFeatures(newFeatures);
  }

  addFillLayer(
    sourceID: string,
    fillPaint?: FillPaint,
    fillLayout?: FillLayout,
    filter?: string[],
    eventHandlers?: any
  ): void {
    const {
      mapbox: { map }
    } = this.props;
    const layerID = `fill-layer-${uuid()}`;

    this.setState(
      state => {
        const oldLayerIDs = state.layerIDs || [];
        const newLayerIds = [...oldLayerIDs, layerID];

        return {
          ...state,
          layerIDs: newLayerIds
        };
      },
      () => {
        if (eventHandlers) {
          Object.entries(eventHandlers).forEach(
            ([eventType, eventHandlerFunction]) => {
              map.on(eventType, layerID, eventHandlerFunction);
            }
          );
        }

        const layer = {
          id: layerID,
          type: "fill",
          source: sourceID,
          layout: fillLayout || {},
          paint: fillPaint || {},
          // this style layer will be applied only to feature with _meta-type: basic-Polygon property in it see: Feature class component
          filter: filter || ["==", "_meta-type", "basic-Polygon"]
        };
        map.addLayer(layer);
      }
    );
  }

  addCircleLayer(
    sourceID: string,
    circlePaint?: CirclePaint,
    circleLayout?: CircleLayout,
    filter?: string[],
    eventHandlers?: any
  ): void {
    const {
      mapbox: { map }
    } = this.props;

    const layerID = `circle-layer-${uuid()}`;

    this.setState(
      state => {
        const oldLayerIDs = state.layerIDs || [];
        const newLayerIds = [...oldLayerIDs, layerID];

        return {
          ...state,
          layerIDs: newLayerIds
        };
      },
      () => {
        if (eventHandlers) {
          Object.entries(eventHandlers).forEach(
            ([eventType, eventHandlerFunction]) => {
              map.on(eventType, layerID, eventHandlerFunction);
            }
          );
        }

        const layer = {
          id: layerID,
          type: "circle",
          source: sourceID,
          layout: circleLayout || {},
          paint: circlePaint || {},
          filter: filter || ["==", "_meta-type", "basic-Point"]
        };
        map.addLayer(layer);
      }
    );
  }

  addLineLayer(
    sourceID: string,
    linePaint?: LinePaint,
    lineLayout?: LineLayout,
    filter?: string[],
    eventHandlers?: any
  ): void {
    const {
      mapbox: { map }
    } = this.props;

    const layerID = `line-layer-${uuid()}`;

    this.setState(
      state => {
        const oldLayerIDs = state.layerIDs || [];
        const newLayerIds = [...oldLayerIDs, layerID];
        return {
          ...state,
          layerIDs: newLayerIds
        };
      },
      () => {
        if (eventHandlers) {
          Object.entries(eventHandlers).forEach(
            ([eventType, eventHandlerFunction]) => {
              map.on(eventType, layerID, eventHandlerFunction);
            }
          );
        }

        const layer = {
          id: layerID,
          type: "line",
          source: sourceID,
          layout: lineLayout ? { ...lineLayout } : {},
          paint: linePaint ? { ...linePaint } : {},
          filter: filter || ["==", "_meta-type", "basic-LineString"]
        };
        map.addLayer(layer);
      }
    );
  }
  /**
   * @desc Creates layers for GeoJson.Feature and passes own context to the children children
   */
  init() {
    const {
      mapbox: { map },
      fillPaint,
      fillLayout,
      linePaint,
      lineLayout,
      circlePaint,
      circleLayout
    } = this.props;
    if (this.state) {
      const { sourceID } = this.state;
      // create layers with styles passed to layer props => styles all features with out own style
      this.addFillLayer(sourceID, StyleUtils.transformFillPaint(fillPaint), {});
      this.addLineLayer(
        sourceID,
        StyleUtils.transformLinePaint(linePaint),
        lineLayout
      );
      this.addCircleLayer(
        sourceID,
        StyleUtils.transformCirclePaint(circlePaint),
        circleLayout
      );

      // takes source from the extended class
      const source: GeoJSONSource = this.getSource();
      this.contextValue = {
        container: null,
        map,
        source: source,
        layer: {
          // passes function to its feature children through context
          addFeature: this.addFeature, // children use this functions to add themselves to the layers data source
          removeFeature: this.removeFeature,
          updateFeature: this.updateFeature
        }
      };
      this.forceUpdate();
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
   * Finds layer which contains feature with the given id and updates its style
   * @param featureID
   * @param paint
   * @param layout
   */
  updateFeatureStyle(featureID: string, paint?: any, layout?: any) {
    const {
      mapbox: { map }
    } = this.props;

    if (paint || layout) {
      // gets all layers which contains the feature
      const renderedFeatures = map.queryRenderedFeatures(undefined, {
        filter: ["==", "_id", `${featureID}`]
      });
      renderedFeatures.forEach((fFeature: any) => {
        const { layer } = fFeature;
        if (layer.filter.includes(featureID)) {
          // features are added to multiple layers, the layers which are created in the init function
          // and those with custom style
          this.updateLayerStyle(layer.id, paint, layout);
        }
      });
    }
  }

  /**
   * Updates features coordinates and style
   * @param featureID
   * @param coordinates
   * @param paint
   * @param layout
   */
  updateFeature(
    featureID: string,
    coordinates: any,
    paint: any,
    layout: any
  ): void {
    const oldFeatures = this.getFeatures();
    this.updateFeatureStyle(featureID, paint, layout);

    const newFeatures = oldFeatures.map((feature: any) => {
      const { _id } = feature.properties;
      if (_id === featureID) {
        feature.geometry.coordinates = [...coordinates];
      }
      return feature;
    });
    this.setFeatures(newFeatures);
  }

  componentDidMount(): void {
    super.componentDidMount();
    const {
      mapbox: { map }
    } = this.props;
    map.on("load", () => {
      // adds layers for circle, fill, line etc...
      this.init();
    });
  }

  removeLayer(layerID: string): void {
    const {
      mapbox: { map }
    } = this.props;
    map.removeLayer(layerID);
  }

  removeAllLayers(): void {
    const { layerIDs } = this.state;
    const {
      mapbox: { map }
    } = this.props;
    layerIDs.forEach(id => {
      this.removeLayer(id);
    });
  }

  componentWillUnmount(): void {
    const {
      mapbox: { map }
    } = this.props;
    try {
      this.removeAllLayers();
      // removes data source
      super.componentWillUnmount();
    } catch (e) {
      console.error(e);
    }
  }
}

// make map context available in this component
export default withMapContext<LayerProps, any>(Layer);
