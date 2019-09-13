import React, {createContext, FC, forwardRef, useContext} from "react";

const MapContext = createContext<any>({})
export const MapContextConsumer = MapContext.Consumer;
export const MapContextProvider = MapContext.Provider;

export const useMapContext = () => useContext<any>(MapContext);

export const withMapContext = <Props, Instance>(
	WrappedComponent: any
	// TODO: Omit CanvasContext in more efficient way
): FC<Props>  => {
	const WithMapContextComponent = (props: any, ref: any) => (
		<MapContextConsumer>
			{(context: any) => <WrappedComponent ref={ref} {...props}  {...context}/>}
		</MapContextConsumer>
	);
	const name =
		WrappedComponent.displayName || WrappedComponent.name || "Component";
	WithMapContextComponent.displayName = `MapComponent(${name})`;
	
	return forwardRef(WithMapContextComponent)
};
