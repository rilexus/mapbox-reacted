import React from "react";
import { withMapContext } from "./Context";
import Feature, { FeatureProps } from "./Feature";
import { EventHandler, FeatureTypes, FillPaint } from "./Types";

interface PolygonProps extends FeatureProps {
  coordinates: number[][][];
  click?: EventHandler;
  properties?: any;
}
interface PolygonState {}

class Polygon extends Feature<PolygonProps, PolygonState> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.Polygon;
  }

  componentDidMount(): void {
    const { coordinates, paint } = this.props;
    this.addFeature({ type: this.featureType, coordinates }, {}, paint);
    super.componentDidMount();
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    super.componentDidUpdate(prevProps, prevState, snapshot);
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
  }
}

export default withMapContext<PolygonProps, any>(Polygon);
