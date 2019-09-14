import React from "react";
import { withMapContext } from "./Context";
import Feature from "./Feature";
import { EventHandler } from "./Types";

interface PolygonProps {
  coordinates: number[][][];
  click?: EventHandler;
}
interface PolygonState {}

class Polygon extends Feature<PolygonProps, PolygonState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates } = this.props;
    this.addFeature({ type: "Polygon", coordinates }, {});
    super.componentDidMount();
  }
}

export default withMapContext<PolygonProps, any>(Polygon);
