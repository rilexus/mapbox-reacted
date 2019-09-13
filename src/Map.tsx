import React, {Component} from "react";
import * as MapBox from 'mapbox-gl';
import {MapContextProvider} from "./Context";

class BaseComponent<Props,State> extends Component<Props,State> {
	constructor(props: Props){
		super(props)
	}
}

interface OwnProps {
	accessToken: string;
	mapContainerId: string;
	style: string;
	center: [number,number];
}
// start at componentDiMount
export class Map extends BaseComponent<OwnProps, any>{
	mapContext: any;
	
	mapElementContainer: any;
	map: any;
	
	componentDidMount(): void {
		const {style, center, accessToken,mapContainerId} = this.props;
		(MapBox as any).accessToken = accessToken;
		
		// create mapBox with passed props
		const map = new MapBox.Map({
			container: mapContainerId, // container id
			style: style,
			center: center, // starting position [lng, lat]
			zoom: 9 // starting zoom
		});
		this.map = map;
		
		// set context for child map components
		this.mapContext = {
			mapElementContainer: this.mapElementContainer,
			map
		};
		// rerender Map component after MapBox is created to provider MapBox instance in context
		this.forceUpdate();
		// see bindMapToContainer function
	}
	
	// safe ref to the map container <div/>
	bindMapToContainer = (container: HTMLDivElement ) => {
		this.mapElementContainer = container;
	};
	
	componentWillUnmount(): void {
		// clean up if map un-mounts
		if (this.map) this.map.remove();
	}
	
	render(): any {
		const {children,mapContainerId} = this.props;
		return (
			<>
				<div id={mapContainerId} ref={this.bindMapToContainer}>
					{ // when context is a available after second render, render children
						this.mapContext ? (
							<MapContextProvider value={this.mapContext}>
								{children}
							</MapContextProvider>
						):null
					}
				</div>
			</>
		);
	}
}