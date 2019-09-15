import React from "react";
import { withMapContext } from "./Context";
import Feature from "./Feature";
import { Lat, Lng } from "./Types";

interface CircleProps {
  coordinates: [Lng, Lat];
}
interface CircleState {}

class Circle extends Feature<CircleProps, CircleState> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    const { coordinates } = this.props;
    this.addFeature({ type: "Point", coordinates }, {});
    super.componentDidMount();
  }
}

export default withMapContext<CircleProps, any>(Circle);
