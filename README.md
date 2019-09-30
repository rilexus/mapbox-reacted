# Mapbox-reacted

A react wrapper around the Mapbox Gl JS: https://docs.mapbox.com/mapbox-gl-js/api/
## Installation
### mapbox-reacted
Install mapbox-reacted with: 
`npm i mapbox-reacted`
### Styles
You need to include the mapbox-gl css styles. This is easy done by including a <link/> element in to the HTML head.
`<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.0/mapbox-gl.css' rel='stylesheet' />`


## Examples

### Show a simple map
```
function Map() {
    return (
        <Map
            accessToken={"mapbox-token"}
            mapContainerId={'map'}
            style={"mapbox://styles/user/unique_token"}
            center={[6.0839, 50.7753]}
            zoom={14}
            containerStyle={{
                height: '100vh',
                width: '100vw',
            }}
         />
    )
}
```
### Popup
```
function App(){
    return (
        <Map
            click={()=>{}}
            accessToken={"xyz"}
            mapContainerId={'map'}
            style={"mapbox://styles/user/unique_token"}
            center={[6.0839, 50.7753]}
            zoom={14}
            containerStyle={{
              height: '600px',
              width: '800px'
            }}
        >
            // You need to add mapbox css styles to the HTML
            <Popup lngLat={[6.0839, 50.7793]}>Map Popup</Popup>
        </Map>
    )
}
```
### Polygon
```
 function App(){
     return (
         <Map
             click={()=>{}}
             mapContainerId={'map'}
             accessToken={"xyz"}
             style={"mapbox://styles/user/unique_token"}
             center={[6.0839, 50.7753]}
             zoom={14}
             containerStyle={{
               height: '600px',
               width: '800px'
             }}
         >
            <LayerSource>
                <Layer
                    layerName={'my-poly'}
                    type={'fill'}
                    fillPaint={{
                        'fill-color': '#088',
                        'fill-opacity': 0.8,
                    }}
                    fillLayout={{ visibility: 'visible' }}
                >           
                    <Polygon
                        coordinates={[
                            [
                                [6.0841331, 50.7764869],
                                [6.0852489, 50.7762799],
                                [6.084809, 50.7755438],
                                [6.0837415, 50.77571],
                                [6.0841331, 50.7764869],
                            ],
                        ]}
                        properties={{
                            name: 'test-polygon 2',
                        }}
                        mouseenter={(e) => {}}
                        mouseover={(e) => {}}
                        click={(e) => {}}
                    />
                </Layer>
            </LayerSource>
         </Map>
     )
 }   
```
### Line
```
 function App(){
     return (
         <Map
             click={()=>{}}
             accessToken={"xyz"}
             mapContainerId={'map'}
             style={"mapbox://styles/user/unique_token"}
             center={[6.0839, 50.7753]}
             zoom={14}
             containerStyle={{
               height: '600px',
               width: '800px'
             }}
         >
            <LayerSource>
                <Layer
                    type={"line"}
                    layerName={"line-layer"}
                    lineLayout={{
                        "line-cap": "round",
                        "line-join": "round"
                    }}
                    linePaint={{
                        "line-width": 5,
                        "line-color": "blue"
                    }}
                >           
                    <Line coordinates={[6.00,50.00]} />
                </Layer>
          
            </LayerSource>
         </Map>
     )
 }   
```
### Cycle
```
function CustomCycle(){
    return (
        <Circle
            coordinates={[6.087253, 50.775521]}
            click={(e: any) => {}}
        />
    )
}
function App(){
    return (
        <Map
            click={()=>{}}
            mapContainerId={'map'}
            accessToken={"xyz"}
            style={"mapbox://styles/user/unique_token"}
            center={[6.0839, 50.7753]}
            zoom={14}
            containerStyle={{
                height: '600px',
                width: '800px'
            }}
        >
            <LayerSource>
                <Layer
                    layerName={"my-circles"}
                    type={LayerTypes.Circle}
                    circlePaint={{
                        "circle-radius": 5,
                        "circle-color": "red"
                      }}
                >
                    <CustomCycle/>
                </Layer>
              
            </LayerSource>
        </Map>
    )
}
```
## Note
This is a alpha version! At this stage its only good to be used for testing purposes.

## License
MIT
See: [LICENSE](LICENSE) file.
