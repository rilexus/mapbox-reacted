import React, { Component } from "react";
import uuid from "uuid";
import { MapContextProvider, withMapContext } from "./Context";

interface DataSourceStateI {
  sourceID: string;
}

/**
 * Adds data geoJson data source to the component which extends this class
 */
class GeoJSONSource<P, S> extends Component<P & any, S & DataSourceStateI> {
  contextValue: any;

  constructor(props: any) {
    super(props);
    this.getSource = this.getSource.bind(this);
    this.setFeatures = this.setFeatures.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
    this.removeFeatures = this.removeFeatures.bind(this);
  }
  /**
   * @desc Returns data source obj for this layer
   */
  getSource() {
    const {
      mapbox: { map }
    } = this.props;
    const { sourceID } = this.state;
    return map.getSource(sourceID);
  }
  /**
   * @desc Sets GeoJson features to the layer data source
   * @param features
   */
  setFeatures(features: GeoJSON.Feature[]): void {
    const source = this.getSource();
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: features
      });
    }
    this.forceUpdate();
  }

  getFeatures(): GeoJSON.Feature[] {
    const source = this.getSource();
    return (source && source._data.features) || [];
  }

  componentDidMount(): void {
    const {
      mapbox: { map }
    } = this.props;
    const sourceID = uuid();

    map.on("load", () => {
      // creates a geojson data source on the map
      this.setState(
        state => ({
          ...state,
          sourceID: sourceID
        }),
        () => {
          map.addSource(sourceID, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: []
            }
          });
          const source = map.getSource(sourceID);
          this.contextValue = {
            ...this.props.mapbox,
            container: {
              source,
              setFeatures: this.setFeatures,
              getSource: this.getSource,
              getFeatures: this.getFeatures,
              removeFeatures:this.removeFeatures
            }
          };
          this.forceUpdate();
        }
      );
    });
  }
  
  removeFeatures(__ids: string[]): void {
    const features = this.getFeatures();
    const newFeatures = features.filter(({ properties }: any) => {
      return !__ids.includes(properties.__id) ;
    });
    this.setFeatures(newFeatures);
  }
  
  componentWillUnmount(): void {
    const {
      mapbox: { map }
    } = this.props;
    map.removeSource(this.state.sourceID);
  }

  render(): any {
    const { children } = this.props;
    if (children === null) return null;
    if (this.contextValue) {
      return (
        <MapContextProvider value={this.contextValue}>
          {children}
        </MapContextProvider>
      );
    }
    return <>{children}</>;
  }
}
export default withMapContext(GeoJSONSource);
