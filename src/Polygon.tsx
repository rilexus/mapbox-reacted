import React from "react";
import { withMapContext } from "./context";
import Feature, { FeatureProps } from "./Feature";
import { EventHandler, FeatureTypes } from "./Types";

interface PolygonProps extends FeatureProps {
  coordinates: number[][][];
  click?: EventHandler;
  mouseover?: EventHandler;
}
interface PolygonState {}

class Polygon extends Feature<PolygonProps, PolygonState> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.Polygon;
  }

  componentDidMount(): void {
    const { coordinates, paint, properties } = this.props;
    this.addFeature({ type: this.featureType, coordinates }, properties || {});
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
