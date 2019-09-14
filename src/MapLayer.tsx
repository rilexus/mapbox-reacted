import React, {Component} from "react";
import {MapContextProvider} from "./Context";


export class MapLayer<Props=any,State=any> extends Component<Props | any,any>{
	contextValue: any;
	
	constructor(props:Props){
		super(props)
	}
	
	componentDidMount(): void {}
	
	render(): any{
		const {children} = this.props;
		if (children === null) return null;
		
		if (this.contextValue) {
			return (
				<MapContextProvider value={this.contextValue}>
					{children}
				</MapContextProvider>
			)
		}
		return <>{children}</>
	}
}
