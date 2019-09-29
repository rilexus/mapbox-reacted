import React, { Component } from 'react';
import uuid from 'uuid';
import { MapContextProvider, withMapContext } from './context';

interface LayerSourceStateI {
  sourceID: string;
  source: any;
}

/**
 * Adds data geoJson data source to the component which extends this class
 */
class LayersSource<P, S> extends Component<P & any, S & LayerSourceStateI> {
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
      mapbox: { map },
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
        type: 'FeatureCollection',
        features: features,
      });
    }
    this.forceUpdate();
  }

  getFeatures(): GeoJSON.Feature[] {
    const source = this.getSource();
    return (source && source._data.features) || [];
  }

  reAddSource = (e: any) => {
    const {
      mapbox: { map },
    } = this.props;
    if (this.state) {
      const { source, sourceID } = this.state;
      const oldSource = map.getSource(sourceID);
      // at this point map has dropped old source
      if (source && !oldSource) {
        map.addSource(sourceID, source.serialize());
      }
    }
  };
  /**
   * 1. Adds data source to the map. See: https://docs.mapbox.com/mapbox-gl-js/example/multiple-geometries/
   * 2. Saves source ref and its id in state
   * 3. Provides own context to children
   * 4. Forces component update
   */
  init = () => {
    const {
      mapbox: { map },
    } = this.props;

    const sourceID = uuid();
    map.addSource(sourceID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    const source = map.getSource(sourceID);

    this.setState(
      state => ({
        ...state,
        sourceID: sourceID,
        source: source, // save source ref in state to be used in reAddSource function
      }),

      () => {
        this.contextValue = {
          ...this.props.mapbox,
          container: {
            source,
            setFeatures: this.setFeatures,
            getSource: this.getSource,
            getFeatures: this.getFeatures,
            removeFeatures: this.removeFeatures,
          },
        };
        this.forceUpdate();
      }
    );
  };

  componentDidMount(): void {
    const {
      mapbox: { map },
    } = this.props;

    // unsubscribe on unmount
    map.on(
      'styledata',
      /*
       * if map style changes, map drops its data source and layers
       * therefore it needs to be re-added
       * see: https://github.com/mapbox/mapbox-gl-js/issues/2267
       * and https://stackoverflow.com/questions/52031176/in-mapbox-how-do-i-preserve-layers-when-using-setstyle
       */
      this.reAddSource
    );

    // unsubscribe on unmount
    map.on('load', this.init);
  }

  removeFeatures(__ids: string[]): void {
    const features = this.getFeatures();
    const newFeatures = features.filter(({ properties }: any) => {
      return !__ids.includes(properties.__id);
    });
    this.setFeatures(newFeatures);
  }

  componentWillUnmount(): void {
    const {
      mapbox: { map },
    } = this.props;
    if (map) {
      const { sourceID } = this.state;
      map.off('styledata', this.reAddSource);
      map.off('load', this.init);
      map.removeSource(sourceID);
    }
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
export default withMapContext(LayersSource);
