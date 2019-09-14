import React from "react";
import uuid from "uuid";
import { Evented } from "./Evented";

interface FeaturePropsI {
  data: any;
}
interface FeatureStateI {
  _id: string;
}
export default class Feature<P, State> extends Evented<
  FeaturePropsI | any,
  FeatureStateI
> {
  mapElement: any;

  constructor(props: any) {
    super(props);
    this.addFeature = this.addFeature.bind(this);
  }

  componentDidMount(): void {
    const {
      mapbox: { map }
    } = this.props;
    this.mapElement = map;
    super.componentDidMount();
  }

  addFeature(geometry: any, properties: any) {
    const {
      mapbox: { layer }
    } = this.props;

    if (layer) {
      const _id = uuid();
      this.setState((state: FeatureStateI) => ({
        ...state,
        _id
      }));

      const feature = {
        type: "Feature",
        geometry: {
          ...geometry
        },
        properties: {
          _id,
          ...properties
        }
      };
      layer.addFeature(feature);
      this.forceUpdate();
    }
  }

  componentWillUnmount(): void {
    const { layer } = this.props;
    if (layer) {
      layer.removeFeature(this.state._id);
    }
  }
  render(): any {
    return null;
  }
}
