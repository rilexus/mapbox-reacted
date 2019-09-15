import React from "react";
import {withMapContext} from "./Context";
import Feature, {FeatureProps} from "./Feature";
import {CircleLayout, CirclePaint, FeatureTypes, Lat, Lng} from "./Types";

interface CircleProps extends FeatureProps {
  coordinates: [Lng, Lat];
  paint?: CirclePaint;
  layout?: CircleLayout;
}
interface CircleState {}

class Circle extends Feature<CircleProps, CircleState> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.Point
  }

  componentDidMount(): void {
    const { coordinates, paint, layout } = this.props;
    this.addFeature({ type: this.featureType, coordinates }, {}, paint, layout);
    super.componentDidMount();
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
