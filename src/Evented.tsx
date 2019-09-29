import React, { Component } from 'react';
import { EventHandler, EventsObject, EventType } from './types';

/**
 * NOTE: "event handler" refers to a function passed to a component which will be called
 * on a event emitted by a element. In most cases its the Mapbox instance.
 * <Component click={()=>{this is a event handle function}}/>
 *
 * This class handles event handlers passed to a component.
 * 1. Extracts event handlers from props
 * 2. binds extracted event handlers to a event emitter, usually the Mapbox instance on component mount
 * 3. re-binds extracted event handlers to a event emitter, usually the Mapbox instance on component update
 * 3. unbinds event handlers on component unmount
 * 4. allows firing events supported by event emitter
 */
export default class Evented<Props, State> extends Component<any, any> {
  recognizedEventTypes = [
    'dblclick',
    'dragend',
    'drag',
    'dragStart',
    'mouseenter',
    'mouseout',
    'contextmenu',
    'touchstart',
    'touchend',
    'move',
    'touchcancel',
    'mouseup',
    'mousemove',
    'mouseleave',
    'mousedown',
    'click',
    'mouseover',
  ];
  mapElement: any;
  /**
   * Holds event handle functions passed to component
   */
  extractedEventHandlers: EventsObject;

  constructor(props: Props) {
    super(props);

    this.extractEventHandlers = this.extractEventHandlers.bind(this);
    this.bindEvents = this.bindEvents.bind(this);
    this.unbindEvents = this.unbindEvents.bind(this);
    this.fireEvent = this.fireEvent.bind(this);

    this.extractedEventHandlers = this.extractEventHandlers(this.props);
  }

  componentDidMount(): void {
    this.bindEvents(this.extractedEventHandlers);
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any
  ): void {
    // Binds/re-binds event handlers passed to component
    this.extractedEventHandlers = this.bindEvents(
      this.extractEventHandlers(this.props),
      this.extractedEventHandlers
    );
  }

  /**
   * Extracts event handlers from given object
   * @param {Object} fromProps
   */
  extractEventHandlers(fromProps: any) {
    // Takes all event functions passed to the component in props if in recognizedEventTypes
    // And saves it in the extractedEventHandlers Object
    return Object.keys(fromProps).reduce((acc: any, propName) => {
      if (
        fromProps[propName] !== null &&
        this.recognizedEventTypes.includes(propName)
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
   * Binds and re-binds passed event handler functions to the component
   * @param {EventsObject} next
   * @param {EventsObject} prev
   * @param eventEmitter
   * @return {EventsObject} event object containing event handlers which are binded to event emitter
   */
  bindEvents(
    next: EventsObject,
    prev: EventsObject = {},
    eventEmitter = this.mapElement
  ): EventsObject {
    // If no element to bind to or element does not support/emit events
    if (!eventEmitter || !eventEmitter.on) {
      return {};
    }

    // Collect new event handlers in this Obj
    const newEventObject: EventsObject = {};

    // Remove prev event handlers from event emitter element
    Object.entries(prev).forEach(
      ([
        eventType /* event name: click, move, etc ... */,
        eventHandler /* function to handle event, passed to component*/,
      ]) => {
        if (prev[eventType] !== next[eventType] || !next[eventType]) {
          // If next event handler changed it will be removed from eventEmitter
          eventEmitter.off(eventType, eventHandler);
        }
        // Keep unchanged event handlers
        if (prev[eventType] === next[eventType]) {
          newEventObject[eventType] = eventHandler;
        }
      }
    );

    // Add next event handlers to eventEmitter
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
    eventsObject: EventsObject = this.extractedEventHandlers,
    element = this.mapElement
  ): void {
    if (!element) {
      return;
    }

    Object.entries(eventsObject).forEach(
      ([eventType, eventHandleFunction]: [EventType, EventHandler]) => {
        element.off(eventType, eventHandleFunction);
      }
    );
  }

  fireEvent(eventType: string, data?: any) {
    if (this.mapElement) {
      this.mapElement.fire(eventType, data);
    }
  }
}
