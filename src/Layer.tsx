import React, { Component } from "react";
import { MapContextProvider, withMapContext } from "./Context";
import { MapLayer } from "./MapLayer";
import uuid from "uuid";
import {
  CirclePaint,
  FillLayout,
  FillPaint,
  GeoJSONSource,
  LineLayout,
  LinePaint
} from "mapbox-gl";

interface LayerStateI {
  features: any[];
  layerID: string;
  sourceID: string;
}
interface LayerProps {
  layerName?: string;

  circlePaint?: CirclePaint;

  fillPaint?: FillPaint;
  fillLayout?: FillLayout;

  linePaint?: LinePaint;
  lineLayout?: LineLayout;
}

class Layer extends MapLayer<LayerProps, LayerStateI> {
  contextValue: any;
  layerDataSource: any;
  constructor(props: any) {
    super(props);

    this.state = {
      features: []
    };

    this.addFeature = this.addFeature.bind(this);
  }
  getSource = () => {
    const {
      mapbox: { map }
    } = this.props;
    const { sourceID } = this.state;
    return map.getSource(sourceID);
  };

  setFeatures = (features: any[]) => {
    const source = this.getSource();
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: features
      });
    }
  };

  getFeatures = () => {
    const source = this.getSource();
    return (source && source._data.features) || [];
  };

  addFeature(feature: any) {
    const oldFeatures = this.getFeatures();
    this.setFeatures([...oldFeatures, feature]);
  }

  removeFeature = (id: string) => {
    const features = this.getFeatures();
    const newFeatures = features.filter(
      ({ properties }: any) => properties.id !== id
    );
    this.setFeatures(newFeatures);
  };

  addFillLayer = () => {
    const {
      mapbox: { map },
      fillPaint
    } = this.props;

    const layerID = uuid();
    map.addLayer({
      id: layerID,
      type: "fill",
      source: this.getSource().id,
      layout: {},
      paint: fillPaint ? { ...fillPaint } : {},
      filter: ["==", "$type", "Polygon"]
    });
  };

  addCircleLayer = () => {
    const {
      mapbox: { map },
      circlePaint
    } = this.props;
    const layerID = uuid();

    map.addLayer({
      id: layerID,
      type: "circle",
      source: this.getSource().id,
      paint: circlePaint ? { ...circlePaint } : {},
      filter: ["==", "$type", "Point"]
    });
  };

  addLineLayer = () => {
    const {
      mapbox: { map },
      linePaint,
      lineLayout
    } = this.props;
    const layerID = uuid();
    map.addLayer({
      id: layerID,
      type: "line",
      source: this.getSource().id,
      layout: lineLayout ? { ...lineLayout } : {},
      paint: linePaint ? { ...linePaint } : {},
      filter: ["==", "$type", "LineString"]
    });
  };

  init = () => {
    const {
      mapbox: { map }
    } = this.props;
    const sourceID = uuid();
    this.setState(
      (state: LayerStateI, props: any) => {
        return {
          ...state,
          sourceID: sourceID
        };
      },
      () => {
        map.addSource(sourceID, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: []
          }
        });
        this.addFillLayer();
        this.addCircleLayer();
        this.addLineLayer();

        const source: GeoJSONSource = this.getSource();

        this.layerDataSource = source;

        this.contextValue = {
          container: null,
          map,
          layer: {
            addFeature: this.addFeature,
            removeFeature: this.removeFeature,
            source: this.layerDataSource
          }
        };
        this.forceUpdate();
      }
    );
  };
  componentDidMount(): void {
    super.componentDidMount();
    const {
      mapbox: { map }
    } = this.props;
    map.on("load", () => {
      this.init();
    });
  }

  componentWillUnmount(): void {
    const { map } = this.props;
    try {
      // map.removeLayer(this.state.layerID);
      map.removeSource(this.state.sourceID);
    } catch (e) {
      console.error(e);
    }
  }
}

// make map context available in this component
export default withMapContext<LayerProps, any>(Layer);
