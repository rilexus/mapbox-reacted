import {Expression, Map, StyleFunction, Transition} from "mapbox-gl";

export type Lat = number;
export type Lng = number;
export type EventType = string;
export type EventHandler = (event: any) => void;
export type EventsObject = { [key: string]: EventHandler };

export interface Layer {
	addFeature: (feature:any)=>void;
	removeFeature:(id:string)=>void
}

export interface FillLayout {
	visibility?: 'visible' | 'none';
}

export interface HeatmapLayout {
	visibility?: 'visible' | 'none';
}

export interface HeatmapPaint {
	'radius'?: number | StyleFunction | Expression;
	'radiusTransition'?: Transition;
	'weight'?: number | StyleFunction | Expression;
	'intensity'?: number | StyleFunction | Expression;
	'intensityTransition'?: Transition;
	'color'?: string | StyleFunction | Expression;
	'opacity'?: number | StyleFunction | Expression;
	'opacityTransition'?: Transition;
}

export interface HillshadeLayout {
	visibility?: 'visible' | 'none';
}

export interface HillshadePaint {
	'illuminationDirection'?: number | Expression;
	'illuminationAnchor'?: 'map' | 'viewport';
	'exaggeration'?: number | Expression;
	'exaggerationTransition'?: Transition;
	'shadowColor'?: string | Expression;
	'shadowColorTransition'?: Transition;
	'highlightColor'?: string | Expression;
	'highlightColorTransition'?: Transition;
	'accentColor'?: string | Expression;
	'accentColorTransition'?: Transition;
}

export interface FillPaint {
	'antialias'?: boolean | Expression;
	'opacity'?: number | StyleFunction | Expression;
	'opacityTransition'?: Transition;
	'color'?: string | StyleFunction | Expression;
	'colorTransition'?: Transition;
	'outlineColor'?: string | StyleFunction | Expression;
	'outlineColorTransition'?: Transition;
	'translate'?: number[];
	'translateTransition'?: Transition;
	'translateAnchor'?: 'map' | 'viewport';
	'pattern'?: string | Expression;
	'patternTransition'?: Transition;
}

export interface LinePaint {
	'opacity'?: number | StyleFunction | Expression;
	'opacityTransition'?: Transition;
	'color'?: string | StyleFunction | Expression;
	'colorTransition'?: Transition;
	'translate'?: number[] | Expression;
	'translateTransition'?: Transition;
	'translateAnchor'?: 'map' | 'viewport';
	'width'?: number | StyleFunction | Expression;
	'widthTransition'?: Transition;
	'gapWidth'?: number | StyleFunction | Expression;
	'gapWidthTransition'?: Transition;
	'offset'?: number | StyleFunction | Expression;
	'offsetTransition'?: Transition;
	'blur'?: number | StyleFunction | Expression;
	'blurTransition'?: Transition;
	'dasharray'?: number[];
	'dasharrayTransition'?: Transition;
	'pattern'?: string | Expression;
	'patternTransition'?: Transition;
	'gradient'?: Expression;
}

export interface LineLayout {
	visibility?: 'visible' | 'none';
	'cap'?: 'butt' | 'round' | 'square';
	'join'?: 'bevel' | 'round' | 'miter' | Expression;
	'miterLimit'?: number | Expression;
	'roundLimit'?: number | Expression;
}

export interface CirclePaint {
	'radius'?: number | StyleFunction | Expression;
	'radiusTransition'?: Transition;
	'color'?: string | StyleFunction | Expression;
	'colorTransition'?: Transition;
	'blur'?: number | StyleFunction | Expression;
	'blurTransition'?: Transition;
	'opacity'?: number | StyleFunction | Expression;
	'opacityTransition'?: Transition;
	'translate'?: number[] | Expression;
	'translateTransition'?: Transition;
	'translateAnchor'?: 'map' | 'viewport';
	'pitchScale'?: 'map' | 'viewport';
	'pitchAlignment'?: 'map' | 'viewport';
	'strokeWidth'?: number | StyleFunction | Expression;
	'strokeWidthTransition'?: Transition;
	'strokeColor'?: string | StyleFunction | Expression;
	'strokeColorTransition'?: Transition;
	'strokeOpacity'?: number | StyleFunction | Expression;
	'strokeOpacityTransition'?: Transition;
}
export interface CircleLayout {
	visibility?: 'visible' | 'none';
}
export interface FillLayout {
	visibility?: 'visible' | 'none';
}

export interface FillPaint {
	'antialias'?: boolean | Expression;
	'opacity'?: number | StyleFunction | Expression;
	'opacityTransition'?: Transition;
	'color'?: string | StyleFunction | Expression;
	'colorTransition'?: Transition;
	'outlineColor'?: string | StyleFunction | Expression;
	'outlineColorTransition'?: Transition;
	'translate'?: number[];
	'translateTransition'?: Transition;
	'translateAnchor'?: 'map' | 'viewport';
	'pattern'?: string | Expression;
	'patternTransition'?: Transition;
}
export enum FeatureTypes {
	Polygon = "Polygon",
	LineString = "LineString",
	Point = "Point"
}

export enum LayerTypes {
	Fill='fill',
	Circle = 'circle',
	Line = 'line'
}
export interface MapContext {
	mapbox?:{
		map?: Map;
		layer?: Layer
		container?: any;
		feature?:any
	}
}
