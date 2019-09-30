# Mapbox-reacted

A react wrapper around the Mapbox Gl JS: https://docs.mapbox.com/mapbox-gl-js/api/
## Installation
### mapbox-reacted
Install mapbox-reacted with: 
`npm i mapbox-reacted`
### Styles
You need to include the mapbox-gl css styles. This is easy done by including a <link/> element in to the HTML head.
`<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v1.4.0/mapbox-gl.css' rel='stylesheet' />`


## Example
```
function App(){
    return (
        <Map
            click={()=>{}}
            accessToken={"xyz"}
            style={"mapbox://styles/user/unique_token"}
            center={[6.0839, 50.7753]}
            zoom={14}
            containerStyle={{
              height: '600px',
              width: '800px'
            }}
        >
            <Popup lngLat={[6.0839, 50.7793]}>Map Popup</Popup>
            <LayerSource>
                <Layer
                    layerName={"lines"}
                    type={"line"}
                    linePaint={{
                        "line-color": "red",
                        "line-width": 2
                    }}
                    filter={["==", "$type", "Polygon"]}
                />
                <Layer
                    move={() => {}}
                    layerName={"my-poly"}
                    type={'fill'}
                    fillPaint={{
                        "fill-color": "#088",
                        "fill-opacity": 0.8
                    }}
                    fillLayout={{ visibility: "visible" }}
                >
                    <Polygon
                       coordinates={
                        [
                          [
                            [6.0841331, 50.7764869],
                            [6.0852489, 50.7762799],
                            [6.084809, 50.7755438],
                            [6.0837415, 50.77571],
                            [6.0841331, 50.7764869]
                          ]
                        ]
                       }
                       properties={{
                            name: "test-polygon 2"
                       }}
                       click={()=>{}}
                       mouseenter={(e: any) => {}}
                       mouseover={(e: any) => {}}
                    />
                </Layer>
            </LayerSource>
        </Map>
    )
}
```

## License
MIT
See: [LICENSE](LICENSE) file.
