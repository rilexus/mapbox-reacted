import React from 'react';
import { withMapContext } from './Context';
import Feature, { IFeatureProps } from './Feature';
import { EventHandler, FeatureTypes, Lat, Lng } from './Types';

interface ICircleProps extends IFeatureProps {
  coordinates: [Lng, Lat];
  click?: EventHandler;
}

class Circle extends Feature<ICircleProps, {}> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.Point;
  }

  componentDidMount(): void {
    super.componentDidMount();
    const { coordinates, properties } = this.props;
    this.addFeature({ type: this.featureType, coordinates }, properties || {});
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    super.componentDidUpdate(prevProps, prevState, snapshot);
  }
}

export default withMapContext<ICircleProps, any>(Circle);
