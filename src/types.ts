// tslint:disable-next-line:file-name-casing
import { Map } from 'mapbox-gl';

export type Lat = number;
export type Lng = number;
export type EventType = string;
export type EventHandler = (event: any) => void;
// tslint:disable-next-line:interface-name
export interface EventsObject { [key: string]: EventHandler };

// tslint:disable-next-line:interface-name
export interface Layer {
  addFeature: (feature: any) => void;
  removeFeature: (id: string) => void;
}

export enum FeatureTypes {
  Polygon = 'Polygon',
  LineString = 'LineString',
  Point = 'Point',
}

export enum LayerTypes {
  Fill = 'fill',
  Circle = 'circle',
  Line = 'line',
}
// tslint:disable-next-line:interface-name
export interface MapContextI {
  mapbox?: {
    map?: Map;
    layer?: {
      layer: Layer & any;
      updateFeature: (...args: any) => void;
      removeFeature: (...args: any) => void;
      addFeature: (...args: any) => void;
    };
    container?: any;
    feature?: any;
  };
}
