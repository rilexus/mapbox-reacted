import { Map } from "mapbox-gl";

export type Lat = number;
export type Lng = number;
export type EventType = string;
export type EventHandler = (event: any) => void;
export type EventsObject = { [key: string]: EventHandler };

export interface Layer {
	addFeature: (feature: any) => void;
	removeFeature: (id: string) => void;
}

export enum FeatureTypes {
	Polygon = "Polygon",
	LineString = "LineString",
	Point = "Point"
}

export enum LayerTypes {
	Fill = "fill",
	Circle = "circle",
	Line = "line"
}
export interface MapContext {
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
