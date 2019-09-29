import React from 'react';
import { withMapContext } from './Context';
import Feature, { IFeatureProps } from './Feature';
import { EventHandler, FeatureTypes } from './Types';

interface IPolygonEvents {
  click?: EventHandler;
  mouseover?: EventHandler;
  mouseenter?: EventHandler;
}

interface IPolygonProps extends IFeatureProps, IPolygonEvents {
  coordinates: number[][][];
}

class Polygon extends Feature<IPolygonProps, {}> {
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

export default withMapContext<IPolygonProps, any>(Polygon);
