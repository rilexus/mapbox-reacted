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
 * @desc Manages passed Feature child components: Polygon, Line, Circle etc
 */
class Layer extends GeoJSONDataSource<LayerProps, LayerStateI> {
  contextValue: any;
  constructor(props: any) {
    super(props);
    this.addFeature = this.addFeature.bind(this);
  }

  /**
   * @desc Adds passed feature to Layer data source. If a style prop is given, it add a new layer for this feature.
   * @param newFeature
   * @param style
   */
  addFeature(newFeature: any, style?: FeatureStyle): void {
    const { type } = newFeature.geometry;
    const { _id } = newFeature.properties;
    const { paint, layout } = style;

    if (paint || layout) {
      const sourceID = this.getSource().id;
      const filterByID = ["==", "_id", `${_id}`];
      switch (type) {
        case FeatureTypes.Polygon:
          this.addFillLayer(sourceID, paint as FillPaint, layout, filterByID);
          break;
        case FeatureTypes.Point: {
          this.addCircleLayer(
            sourceID,
            paint as CirclePaint,
            layout,
            filterByID
          );
          break;
        }
        case FeatureTypes.LineString: {
          this.addLineLayer(sourceID, paint as LinePaint, layout, filterByID);
          break;
        }
      }
    }

    const oldFeatures = this.getFeatures();
    this.setFeatures([...oldFeatures, newFeature]);
  }

  removeFeature = (id: string): void => {
    const features = this.getFeatures();
    const newFeatures = features.filter(
      ({ properties }: any) => properties.id !== id
    );
    this.setFeatures(newFeatures);
  };

  addFillLayer = (
    sourceID: string,
    fillPaint?: FillPaint,
    fillLayout?: FillLayout,
    filter?: string[]
  ): void => {
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
        const layer = {
          id: layerID,
          type: "fill",
          source: sourceID,
          layout: fillLayout || {},
          paint: fillPaint || {},
          filter: filter || ["==", "_meta-type", "basic-Polygon"]
        };
        map.addLayer(layer);
      }
    );
  };

  addCircleLayer = (
    sourceID: string,
    circlePaint?: CirclePaint,
    circleLayout?: CircleLayout,
    filter?: string[]
  ): void => {
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
  };

  // adds a line layer to the data source
  addLineLayer = (
    sourceID: string,
    linePaint?: LinePaint,
    lineLayout?: LineLayout,
    filter?: string[]
  ): void => {
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
  };
  /**
   * @desc Creates a data source, layers for GeoJson.Feature and passes own context to its children
   */
  init = () => {
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

      const source: GeoJSONSource = this.getSource();
      this.contextValue = {
        container: null,
        map,
        source: source,
        layer: {
          // passes function to its feature children through context
          addFeature: this.addFeature,
          removeFeature: this.removeFeature,
          updateFeature: this.updateFeature
        }
      };
      this.forceUpdate();
    }
  };

  updateLayerStyle = (layerID: string, paint?: any, layout?: any) => {
    const {
      mapbox: { map }
    } = this.props;

    if (paint) {
      Object.entries(paint).forEach(([paintProperty, paintValue]) => {
        map.setPaintProperty(layerID, paintProperty, paintValue);
      });
    }
    if (layout) {
      Object.entries(layout).forEach(([layoutProperty, layoutValue]) => {
        map.setLayoutProperty(layerID, layoutProperty, layoutValue);
      });
    }
  };

  updateFeatureStyle = (featureID: string, paint?: any, layout?: any) => {
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
  };

  updateFeature = (
    featureID: string,
    coordinates: any,
    paint: any,
    layout: any
  ) => {
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
  };

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

  removeLayer = (layerID: string) => {
    const {
      mapbox: { map }
    } = this.props;
    map.removeLayer(layerID);
  };

  removeAllLayers = () => {
    const { layerIDs } = this.state;
    const {
      mapbox: { map }
    } = this.props;
    layerIDs.forEach(id => {
      this.removeLayer(id);
    });
  };

  componentWillUnmount(): void {
    const {
      mapbox: { map }
    } = this.props;
    try {
      this.removeAllLayers();
      super.componentWillUnmount();
    } catch (e) {
      console.error(e);
    }
  }
}

// make map context available in this component
export default withMapContext<LayerProps, any>(Layer);
