import {FeatureTypes} from "./Types";

function splitStyle(style: { [key: string]: any }) {
	// split by UpperCase letter, to lower case and join with "-"
	if (!style) return
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
	if (!toStyle) return ;
	return Object.entries(toStyle).reduce((acc, [prop, value]) => {
		if (prop === 'visibility') return  {...acc,[prop]:value};
		return {
			...acc,
			[`${prefix}-${prop}`]: value
		};
	}, {});
}
function transformPaint(type: FeatureTypes,paint:any) {
	if (!paint) return;
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

function transformFillPaint(style:{[key:string]:any}) {
	return prepend('fill', splitStyle(style));
}
function transformCirclePaint(style:{[key:string]:any}) {
	return prepend('circle', splitStyle(style));
}
function transformLinePaint(style:{[key:string]:any}) {
	return prepend('line', splitStyle(style));
}
function transformHeatmapPaint(style:{[key:string]:any}) {
	return prepend('heatmap', splitStyle(style));
}
function transformHillshadePaint(style:{[key:string]:any}) {
	return prepend('hillshade', splitStyle(style));
}
function transformRasterPaint(style:{[key:string]:any}) {
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