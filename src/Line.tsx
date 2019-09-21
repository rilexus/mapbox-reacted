import React from "react";
import {withMapContext} from "./Context";
import Feature, {FeatureProps} from "./Feature";
import {EventHandler, FeatureTypes, LineLayout, LinePaint} from "./Types";


interface LineProps extends FeatureProps{
  coordinates: number[][];
  click?: EventHandler;
}
interface LineState {}

class Line extends Feature<LineProps, LineState> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.LineString
  }

  componentDidMount(): void {
    const { coordinates,properties} = this.props;
    this.addFeature({ type: this.featureType, coordinates },properties|| {});
    super.componentDidMount();
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    super.componentDidUpdate(prevProps, prevState, snapshot);
  }
 
}

export default withMapContext<LineProps, any>(Line);
