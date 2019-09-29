import React from 'react';
import { withMapContext } from './Context';
import Feature, { IFeatureProps } from './Feature';
import { EventHandler, FeatureTypes } from './types';

interface ILineProps extends IFeatureProps {
  coordinates: number[][];
  click?: EventHandler;
}

class Line extends Feature<ILineProps, {}> {
  constructor(props: any) {
    super(props);
    this.featureType = FeatureTypes.LineString;
  }

  componentDidMount(): void {
    const { coordinates, properties } = this.props;
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
}

export default withMapContext<ILineProps, any>(Line);
