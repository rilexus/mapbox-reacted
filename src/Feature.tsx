import React, { Component } from "react";
import uuid from "uuid";

interface OwnPropsI {
  data: any;
}
interface FeatureStateI {
  _id: string;
}
export class Feature<P, State> extends Component<
  OwnPropsI | any,
  FeatureStateI
> {
  constructor(props: any) {
    super(props);
    this.addFeature = this.addFeature.bind(this);
  }

  addFeature(geometry: any, properties: any) {
    const { layerContext, mapElementContainer } = this.props;

    console.log(mapElementContainer);
    if (layerContext) {
      const _id = uuid();
      this.setState(state => ({
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
      layerContext.addFeature(feature);
      this.forceUpdate();
    }
  }

  componentWillUnmount(): void {
    const { layer } = this.props;
    if (layer) {
      layer.removeFeature(this.state._id);
    }
  }
}
