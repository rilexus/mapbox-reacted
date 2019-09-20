import React, { Component } from "react";
import { EventHandler, EventsObject, EventType } from "./Types";

export class Evented<Props, State> extends Component<any, any> {
  mapEventTypes = [
    "dblclick",
    "mouseenter",
    "mouseout",
    "contextmenu",
    "touchstart",
    "touchend",
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
    this.bindEventProps = this.bindEventProps.bind(this);
    this.extractedEvents = this.extractMapEventProps();
  }

  componentDidMount(): void {
    // this.bindEventProps(this.mapElement);
  }

  extractMapEventProps() {
    // takes all event functions in mapEventTypes passed to the component in props
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

  bindEventProps(element: any) {
    Object.entries(this.extractedEvents).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        element.on(eventType, eventHandleFunction);
      }
    );
  }
}
