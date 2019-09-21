import React, { Component, Fragment } from "react";
import { MapContextProvider } from "./Context";
import { Evented } from "./Evented";

export class MapLayer extends Evented<any, any> {
  contextValue: any = null;

  constructor(props: any) {
    super(props);
  }

  componentDidMount(): void {}

  render(): any {
    const { children } = this.props;
    if (children === null) return null;
    // console.log("map layer: ", this.contextValue);

    if (this.contextValue)
      return (
        <MapContextProvider value={this.contextValue}>
          {children}
        </MapContextProvider>
      );

    return null;
  }
}
