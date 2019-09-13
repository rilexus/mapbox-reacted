import React, {Component} from "react";
import {MapContextProvider} from "./Context";


export class MapLayer<Props=any,State=any> extends Component<Props | any,any>{
	mapContext: any;
	
	constructor(props:Props){
		super(props)
	}
	
	componentDidMount(): void {}
	
	render(): any{
		const {children} = this.props;
		if (children === null) return null;
		
		if (this.mapContext) {
			return (
				<MapContextProvider value={this.mapContext}>
					{children}
				</MapContextProvider>
			)
		}
		return <>{children}</>
	}
}
