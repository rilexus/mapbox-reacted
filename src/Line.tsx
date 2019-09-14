import React from "react";
import { withMapContext } from "./Context";
import Feature from "./Feature";
import { EventHandler } from "./Types";

interface LineProps {
  coordinates: number[][];
  click?: EventHandler;
}
interface LineState {}

class Line extends Feature<LineProps, LineState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates } = this.props;
    this.addFeature({ type: "LineString", coordinates }, {});
    super.componentDidMount();
  }
}

export default withMapContext<LineProps, any>(Line);
