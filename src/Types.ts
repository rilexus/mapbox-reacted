// tslint:disable-next-line:file-name-casing
import { Map } from 'mapbox-gl';

export type Lat = number;
export type Lng = number;
export type EventType = string;
export type EventHandler = (event: any) => void;
export type EventsObject = { [key: string]: EventHandler };

export interface ILayer {
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

export interface IMapContext {
  mapbox?: {
    map?: Map;
    layer?: {
      layer: ILayer & any;
      updateFeature: (...args: any) => void;
      removeFeature: (...args: any) => void;
      addFeature: (...args: any) => void;
    };
    container?: any;
    feature?: any;
  };
}
