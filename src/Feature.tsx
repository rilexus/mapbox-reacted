import React from "react";
import uuid from "uuid";
import { Evented } from "./Evented";
import { FeatureTypes } from "./Types";
import { StyleUtils } from "./utils";

export interface FeatureProps {
  paint?: any;
  layout?: any;
  coordinates: any;
}
interface FeatureStateI {
  _id: string;
}
export default class Feature<P, State> extends Evented<
  FeatureProps | any,
  FeatureStateI
> {
  featureType: FeatureTypes;
  mapElement: any;

  constructor(props: any) {
    super(props);
    this.addFeature = this.addFeature.bind(this);
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    const {
      mapbox: { layer },
      paint,
      coordinates,
      layout
    } = this.props;
    if (layer) {
      layer.updateFeature(
        this.state._id,
        coordinates,
        StyleUtils.transformPaint(this.featureType, paint),
        layout
      );
    }
  }

  componentDidMount(): void {
    const {
      mapbox: { map }
    } = this.props;
    this.mapElement = map;
    super.componentDidMount();
  }

  addFeature(
    geometry: GeoJSON.Geometry,
    properties: any,
    paint?: any,
    layout?: any
  ) {
    const {
      mapbox: { layer }
    } = this.props;

    if (layer) {
      const _id = uuid();
      // save unique id for the feature
      this.setState(
        (state: FeatureStateI) => ({
          ...state,
          _id
        }),
        () => {
          const hasOwnStyle = !!(paint || layout);
          const feature = {
            type: "Feature",
            geometry: {
              ...geometry
            },
            properties: {
              ...properties,
              _id,
              "_meta-type": `${hasOwnStyle ? "custom" : "basic"}-${
                geometry.type
              }`
            }
          };
          layer.addFeature(
            feature,
            // this.extractedEvents
          );
          this.forceUpdate();
        }
      );
    }
  }

  componentWillUnmount(): void {
    const {
      mapbox: { layer }
    } = this.props;
    if (layer) {
      layer.removeFeature(this.state._id);
    }
  }
  render(): any {
    return null;
  }
}
