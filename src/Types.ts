import {Map} from "mapbox-gl";

export type Lat = number;
export type Lng = number;
export type EventType = string;
export type EventHandler = (event: Event) => void;
export type EventsObject = { [key: string]: EventHandler };

export interface Layer {
	addFeature: (feature:any)=>void;
	removeFeature:(id:string)=>void
}

export interface MapContext {
	map?: Map;
	layer?: Layer
	container?: any
}
