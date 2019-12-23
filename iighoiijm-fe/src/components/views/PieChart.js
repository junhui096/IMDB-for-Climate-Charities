import React, { Component } from 'react';
//import './App.css'
import axios from 'axios';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { pie, arc } from 'd3-shape';

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state= {
      incidentData:[],
    }
  }

  componentDidMount() {
    const url1 =
      'http://api.leavethekeys.me/incident';
    axios
      .get(url1)
      .then(res => {
        const incidentData = res.data.incidents;
        if (incidentData.error) {
          this.props.history.push('/not-found');
        } else {
          this.setState({
            incidentData: incidentData
          });
        }
      })
      .catch(err => console.log(err));
  }

  createPieChart() {
      const dataRaw=this.state.incidentData.map(d => parseInt(d.Date.substring(0,2)));
      var data=[{month:"January", val:0},
                {month:"February", val:0},
                {month:"March", val:0},
                {month:"April", val:0},
                {month:"May", val:0},
                {month:"June", val:0},
                {month:"July", val:0},
                {month:"August", val:0},
                {month:"September", val:0},
                {month:"October", val:0},
                {month:"November", val:0},
                {month:"December", val:0}];
      for(var i=1; i<13; i++){
        for(var j=0; j<dataRaw.length; j++){
          if(dataRaw[j]===i){
            data[i-1].val++;
          }
        }
      }

      var ars = pie().value(function(d) {return d.val}).sort(null);
      var arcs=ars(data);;
      const node = this.node;
      var a = arc()
        .innerRadius(0)
        .outerRadius(250 - 1);

      select(node)
        .append('g')
        .selectAll("path")
        .data(arcs)
        .enter().append("path")
        .attr("fill", d => interpolateSpectral(d.index/8))
        .attr("stroke", "white")
        .attr("d", a)
        .attr("transform", `translate(250,250)`)
        .append("title")
        .text("DUI Incidents by Month")
        .attr("transform", `translate(250,250)`);

  const text = select(node)
    .selectAll("text")
    .data(arcs)
    .enter().append("text")
    .attr("transform", d => `translate(${a.centroid(d)[0]+240},${a.centroid(d)[1]+240})`)
    .attr("dy", "0.35em");

  text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
      .attr("x", 0)
      .attr("y", "0.7em")
      .attr("fill-opacity", 0.7)
      .text(d => d.data.month+": "+ d.data.val)
      .attr("transform", `translate(240,240)`);


      return node;
  }
  render() {
      this.createPieChart();
    return (
      <div>
          <h1 className="mt-5">DWI Incidents By Month</h1>
          <svg className="m-5"
            ref={node => (this.node = node)}
            width={500}
            height={500}
          />
      </div>
    );
  }
}
export default PieChart;
