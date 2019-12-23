import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps"
import data from "../common/world-50m-with-population.json"

const wrapperStyles = {
  width: "100%",
  maxWidth: 980,
  margin: "0 auto",
}

class BasicMap extends Component {
  constructor(props){
    super(props);
    this.state={
      data: [],
      colorTrue: "#17a2b8",
      colorTrueHover: "#ffc107"
    };
  }

  componentDidMount(){
    if(this.props.data) {
      this.setState({
        data:this.props.data
      });
    }
  }
  handleClick(countryCode){
      this.props.history.push(`/countries/countryCode=${countryCode}`);
  }
  render() {
    return (
      <div style={wrapperStyles}>
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11,0,0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "auto",
          }}
          >
          <ZoomableGroup center={[0,20]}>
            <Geographies geography={ data }>
              {(geographies, projection) => geographies.map((geography, i) => (
                <Geography
                  key={ i }
                  geography={ geography }
                  projection={ projection }
                  onClick={() => this.handleClick(data.objects.units.geometries[i].properties.adm0_a3)}
                  style={{
                    default: {
                      fill: this.props.data.includes(data.objects.units.geometries[i].properties.adm0_a3)? "#17a2b8":"#ECEFF1",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#ffc107",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#263238",
                      stroke: "#607D8B",
                      strokeWidth: 0.75,
                      outline: "none",
                    }
                  }}
                />
              ))}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    )
  }
}

export default withRouter(BasicMap)
