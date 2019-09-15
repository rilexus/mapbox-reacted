import React from "react";
import { withMapContext } from "./Context";
import Feature from "./Feature";
import { EventHandler } from "./Types";
import {FillPaint} from "mapbox-gl";

interface PolygonProps {
  coordinates: number[][][];
  click?: EventHandler;
  fillPaint?: FillPaint;
}
interface PolygonState {}

class Polygon extends Feature<PolygonProps, PolygonState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates,fillPaint } = this.props;
    this.addFeature({ type: "Polygon", coordinates }, { }, fillPaint);
    super.componentDidMount();
  }
}

export default withMapContext<PolygonProps, any>(Polygon);
