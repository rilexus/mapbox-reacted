import React from 'react';
import { withMapContext } from './context';
import Feature, { FeatureProps } from './Feature';
import { EventHandler, FeatureTypes } from './types';

// tslint:disable-next-line:interface-name
interface PolygonEvents {
  click?: EventHandler;
  mouseover?: EventHandler;

  mouseenter?: EventHandler;
}

// tslint:disable-next-line:interface-name
interface PolygonProps extends FeatureProps, PolygonEvents {
  coordinates: number[][][];
}

class Polygon extends Feature<PolygonProps, {}> {
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
