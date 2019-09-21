import React from "react";
import { withMapContext } from "./Context";
import Feature, { FeatureProps } from "./Feature";
import {
  CircleLayout,
  CirclePaint,
  EventHandler,
  FeatureTypes,
  Lat,
  Lng
} from "./Types";

interface CircleProps extends FeatureProps {
  coordinates: [Lng, Lat];
  click?: EventHandler;
}
interface CircleState {}

class Circle extends Feature<CircleProps, CircleState> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.Point;
  }

  componentDidMount(): void {
    super.componentDidMount();
    const { coordinates, properties } = this.props;
    this.addFeature({ type: this.featureType, coordinates }, properties || {});
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    super.componentDidUpdate(prevProps, prevState, snapshot);
  }
}

export default withMapContext<CircleProps, any>(Circle);
