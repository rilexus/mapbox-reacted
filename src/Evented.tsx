import React, { Component } from "react";
import { EventHandler, EventsObject, EventType } from "./Types";

export class Evented<Props, State> extends Component<any, any> {
  mapEventTypes = [
    "dblclick",
    "dragend",
    "drag",
    "dragStart",
    "mouseenter",
    "mouseout",
    "contextmenu",
    "touchstart",
    "touchend",
    "move",
    "touchcancel",
    "mouseup",
    "mousemove",
    "mouseleave",
    "mousedown",
    "click",
    "mouseover"
  ];
  mapElement: any;
  // contains all event functions (click, mouseleave, mouseover, ... ) passed to component which extends this class
  extractedEvents: EventsObject;

  constructor(props: Props) {
    super(props);
    this.extractMapEventProps = this.extractMapEventProps.bind(this);
    this.bindEventTo = this.bindEventTo.bind(this);
    this.extractedEvents = this.extractMapEventProps();
  }

  componentDidMount(): void {}

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {}

  extractMapEventProps() {
    // takes all event functions passed to the component in props if in mapEventTypes
    // and saves it in the extractedEvents Object
    return Object.keys(this.props).reduce((acc: any, propName) => {
      if (
        this.props[propName] !== null &&
        this.mapEventTypes.includes(propName)
      ) {
        acc[propName] = this.props[propName];
      }
      return acc;
    }, {});
  }

  componentWillUnmount(): void {}

  bindEvents = () => {
    Object.entries(this.extractedEvents).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        this.mapElement.on(eventType, eventHandleFunction);
      }
    );
  };

  unbindEvents = () => {
    Object.entries(this.extractedEvents).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        this.mapElement.off(eventType, eventHandleFunction);
      }
    );
  };

  bindEventTo(element: any) {
    Object.entries(this.extractedEvents).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        element.on(eventType, eventHandleFunction);
      }
    );
  }
}
