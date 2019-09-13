import React, { Component } from "react";
import { withMapContext } from "./Context";
import { Feature } from "./Feature";
import uuid from "uuid";

interface PolygonProps {
  coordinates: number[][][];
}
interface PolygonState {}
class Polygon extends Feature<PolygonProps, PolygonState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates } = this.props;
    this.addFeature({ type: "Polygon", coordinates }, {});
  }

  render(): any {
    return null;
  }
}
export default withMapContext<PolygonProps, any>(Polygon);
