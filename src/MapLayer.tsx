import React, { Component, Fragment } from 'react';
import { MapContextProvider } from './context';
import { Evented } from './Evented';

export class MapLayer<P, S> extends Evented<P, any> {
  contextValue: any = null;

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {
    super.componentDidMount();
  }
  componentDidUpdate(prevProps: any, prevState: any, snapshot?: any): void {
    super.componentDidUpdate(prevProps, prevState, snapshot);
  }

  render(): any {
    const { children } = this.props;
    if (children === null) {
      return null;
    }

    if (this.contextValue) {
      return (
        <MapContextProvider value={this.contextValue}>
          {children}
        </MapContextProvider>
      );
    }

    return null;
  }
}
