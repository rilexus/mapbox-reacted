import React, { Component } from "react";
import uuid from "uuid";
import { MapContextProvider } from "./Context";

interface DataSourceStateI {
  sourceID: string;
}
abstract class GeoJSONDataSource<P, S> extends Component<
  P & any,
  S & DataSourceStateI
> {
  contextValue: any;

  constructor(props: any) {
    super(props);
    this.getSource = this.getSource.bind(this);
    this.setFeatures = this.setFeatures.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
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
  }

  getFeatures(): GeoJSON.Feature[] {
    const source = this.getSource();
    return (source && source._data.features) || [];
  }

  componentDidMount(): void {
    /**
     * @desc Layer manages its feature children with help of a data source
     * @see https://docs.mapbox.com/mapbox-gl-js/example/live-geojson/
     */
    const {
      mapbox: { map }
    } = this.props;
    const sourceID = uuid();

    map.on("load", () => {
      // adds a geojson data source and adds layers for circle, fill, line etc...
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
          this.forceUpdate();
        }
      );
    });
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
export default GeoJSONDataSource;
