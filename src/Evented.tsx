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
    this.extractEventHandlers = this.extractEventHandlers.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.unbindEvents = this.unbindEvents.bind(this);

    this.extractedEvents = this.extractEventHandlers(this.props);
  }

  componentDidMount(): void {
    this.bindEvents(this.extractedEvents);
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    // binds/re-binds event handlers passed to component
    this.extractedEvents = this.bindEvents(
      this.extractEventHandlers(this.props),
      this.extractedEvents
    );
  }

  /**
   * Extracts event handlers from given object
   * @param {Object} fromProps
   */
  extractEventHandlers(fromProps: any) {
    // takes all event functions passed to the component in props if in mapEventTypes
    // and saves it in the extractedEvents Object
    return Object.keys(fromProps).reduce((acc: any, propName) => {
      if (
        fromProps[propName] !== null &&
        this.mapEventTypes.includes(propName)
      ) {
        acc[propName] = fromProps[propName];
      }
      return acc;
    }, {});
  }

  componentWillUnmount(): void {
    this.unbindEvents();
  }

  /**
   * binds and rebinds passed event handler functions to the component
   * @param {EventsObject} next
   * @param {EventsObject} prev
   * @param eventEmitter
   */
  bindEvents(
    next: EventsObject,
    prev: EventsObject = {},
    eventEmitter = this.mapElement
  ): EventsObject {
    // if no element to bind to or element does not support/emit events
    if (!eventEmitter || !eventEmitter.on) return {};

    // collect new event handlers in this Obj
    const newEventObject: EventsObject = {};

    // remove prev event handlers from event emitter element
    Object.entries(prev).forEach(
      ([
        eventType /* event name: click, move, etc ... */,
        eventHandler /* function to handle event, passed to component*/
      ]) => {
        if (prev[eventType] !== next[eventType] || !next[eventType]) {
          // if next event handler changed or was does not exist in next eventObject
          // it will be removed from eventEmitter
          eventEmitter.off(eventType, eventHandler);
        }
        // keep unchanged event handlers
        if (prev[eventType] === next[eventType])
          newEventObject[eventType] = eventHandler;
      }
    );

    // add next event handlers to eventEmitter
    Object.entries(next).forEach(([eventType, eventHandler]) => {
      if (next[eventType] !== prev[eventType] || !prev[eventType]) {
        newEventObject[eventType] = eventHandler;
        eventEmitter.on(eventType, eventHandler);
      }
    });
    return newEventObject;
  }

  /**
   * Unbinds event handlers from given element.
   * @param eventsObject
   * @param element
   */
  unbindEvents(
    eventsObject: EventsObject = this.extractedEvents,
    element = this.mapElement
  ): void {
    if (!element) return;

    Object.entries(eventsObject).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        element.off(eventType, eventHandleFunction);
      }
    );
  }
}
