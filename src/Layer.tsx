import React from "react";
import uuid from "uuid";
import {
  FillPaint,
  CirclePaint,
  CircleLayout,
  LinePaint,
  LineLayout,
  FillLayout
} from "mapbox-gl";
import { EventHandler, LayerTypes, MapContext } from "./Types";
import { MapLayer } from "./MapLayer";
import { withMapContext } from "./context";

interface LayerStateI {
  layerID: string;
  serializedLayer: any;
}

interface LayerEventsI {
  click?: EventHandler;
  move?: EventHandler;
}

interface LayerProps extends LayerEventsI {
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

class Layer extends MapLayer<LayerProps & MapContext> {
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
  }

  /**
   * @desc Adds geoJSON feature to the data source
   * @param newFeature
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

  reAddLayer = () => {
    const {
      mapbox: { map }
    } = this.props;
    const { layer: curLayer } = this.state;
    if (curLayer) {
      const { id: curLayerID } = curLayer;
      const layerExistOnMap = map
        .getStyle()
        .layers.some(
          ({ id: layerOnMapID }: { id: string }) => layerOnMapID === curLayerID
        );
      if (!layerExistOnMap) {
        map.addLayer(curLayer.serialize());
      }
    }
  };

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

      let paint = {};
      let layout = {};
      let _filter: string[] = [""];

      if (type === LayerTypes.Fill) {
        paint = fillPaint;
        layout = fillLayout;
        _filter = ["==", "$type", "Polygon"];
      }
      if (type === LayerTypes.Circle) {
        paint = circlePaint;
        _filter = ["==", "$type", "Point"];
      }
      if (type === LayerTypes.Line) {
        paint = linePaint;
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

      this.setState(
        (curState: LayerStateI) => ({
          ...curState,
          layerID: layerID,
          layer: layer
        }),
        () => {
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
    const {
      mapbox: { map }
    } = this.props;
    map.on("styledata", this.reAddLayer);
    this.init();
  }

  componentWillUnmount(): void {
    const {
      mapbox: { map }
    } = this.props;
    try {
      map.off("styledata", this.reAddLayer);

      const { layerID } = this.state;
      if (layerID) {
        map.removeLayer(layerID);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// make map context available in this component
export default withMapContext<LayerProps, any>(Layer);
