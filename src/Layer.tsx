import React, { Component } from "react";
import { MapContextProvider, withMapContext } from "./Context";
import { MapLayer } from "./MapLayer";
import uuid from "uuid";
import { GeoJSONSource } from "mapbox-gl";

interface LayerStateI {
  features: any[];
  layerID: string;
  sourceID: string;
}
interface LayerProps {
  layerName?: string;
}

class Layer extends MapLayer<LayerProps, LayerStateI> {
  mapContext: any;
  layerDataSource: any;
  constructor(props: any) {
    super(props);

    this.state = {
      features: []
    };

    this.addFeature = this.addFeature.bind(this);
  }
  getSource = () => {
    const { map } = this.props;
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

  componentDidMount(): void {
    super.componentDidMount();

    const { map, mapElementContainer, layerName } = this.props;

    const thisLayerID = layerName || uuid();
    const sourceID = uuid();

    map.on("load", () => {
      this.setState(
        (state: LayerStateI, props: any) => {
          return {
            ...state,
            layerID: thisLayerID,
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
          map.addLayer({
            id: thisLayerID,
            type: "fill",
            source: sourceID,
            layout: {},
            paint: {
              "fill-color": "#088",
              "fill-opacity": 0.8
            }
          });

          const source: GeoJSONSource = map.getSource(sourceID);

          this.layerDataSource = source;

          this.mapContext = {
            mapElementContainer,
            map,
            layer: {
              addFeature: this.addFeature,
              removeFeature: this.removeFeature,
              layerDataSource: this.layerDataSource
            }
          };
          this.forceUpdate();
        }
      );
    });
  }

  componentWillUnmount(): void {
    const { map } = this.props;
    map.removeLayer(this.state.layerID);
    map.removeSource(this.state.sourceID);
  }
}

// make map context available in this component
export default withMapContext<LayerProps, any>(Layer);
