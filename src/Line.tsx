import React from "react";
import { withMapContext } from "./Context";
import Feature from "./Feature";
import { EventHandler } from "./Types";
import {LineLayout, LinePaint} from "mapbox-gl";

interface LineProps {
  coordinates: number[][];
  click?: EventHandler;
  linePaint?: LinePaint;
  lineLayout?: LineLayout;
}
interface LineState {}

class Line extends Feature<LineProps, LineState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates,linePaint, lineLayout } = this.props;
    this.addFeature({ type: "LineString", coordinates }, {},linePaint,lineLayout);
    super.componentDidMount();
  }
}

export default withMapContext<LineProps, any>(Line);
