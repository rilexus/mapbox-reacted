import {FeatureTypes} from "./types";

function splitStyle(style: { [key: string]: any }) {
	// split by UpperCase letter, to lower case and join with "-"
	if (!style) return;
	return Object.entries(style).reduce((acc, [prop, value]) => {
		if (prop === 'visibility') return  {...acc,[prop]:value};
		const normProps = prop
		.split(/(?=[A-Z])/)
		.map(s => s.toLowerCase())
		.join("-");
		return {
			...acc,
			[normProps]: value
		};
	}, {});
}

function prepend(prefix:string,toStyle:{[key:string]:any}) {
	if (!toStyle) return;
	return Object.entries(toStyle).reduce((acc, [prop, value]) => {
		if (prop === 'visibility') return  {...acc,[prop]:value};
		return {
			...acc,
			[`${prefix}-${prop}`]: value
		};
	}, {});
}
function transformPaint(type: FeatureTypes,paint:any) {
	if (!paint) return ;
	switch (type) {
		case FeatureTypes.LineString:{
			return StyleUtils.transformLinePaint(paint);
		}
		case FeatureTypes.Point:{
			return StyleUtils.transformCirclePaint(paint);
		}
		case FeatureTypes.Polygon:{
			return StyleUtils.transformFillPaint(paint);
		}
	}
}

type CSSLkeProperties = {
	[key:string]: any
}

function transformFillPaint(style:CSSLkeProperties) {
	return prepend('fill', splitStyle(style));
}
/**
 * Returns mapbox compliant line-paint style
 * @param {CSSLkeProperties} style
 */
function transformCirclePaint(style:CSSLkeProperties) {
	return prepend('circle', splitStyle(style));
}

/**
 * @desc Returns mapbox compliant line-paint style
 * @param {CSSLkeProperties} style
 */
function transformLinePaint(style: CSSLkeProperties) {
	return prepend('line', splitStyle(style));
}

/**
 * @desc Returns mapbox compliant heatmap-paint style
 * @param style
 */
function transformHeatmapPaint(style: CSSLkeProperties) {
	return prepend('heatmap', splitStyle(style));
}

/**
 * @desc Returns mapbox compliant hillshade-paint style
 * @param style
 */
function transformHillshadePaint(style: CSSLkeProperties) {
	return prepend('hillshade', splitStyle(style));
}
/**
 * @desc Returns mapbox compliant raster-paint style
 * @param style
 */
function transformRasterPaint(style: CSSLkeProperties) {
	return prepend('raster', splitStyle(style));
}



export const StyleUtils = {
	transformCirclePaint,
	transformFillPaint,
	transformHeatmapPaint,
	transformHillshadePaint,
	transformLinePaint,
	transformRasterPaint,
	transformPaint
}
