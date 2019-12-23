import React, { Component } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import SmoothChart from './SmoothChart';
import axios from 'axios';
import Basic from './Basic';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { pie, arc } from 'd3-shape';

class D3Vis extends Component {
  constructor(props) {
    super(props);
    this.state= {
      incidentData:null,
      tabcData:null
    }
  }

  componentDidMount() {
    const url1 =
      'http://api.leavethekeys.me/incident';
    const url2 =
      'http://api.leavethekeys.me/tabc';

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
        return axios.get(url2);
      })
      .then(res => {
        const tabcData = res.data.licences;
        if (tabcData.error) {
          this.props.history.push('/not-found');
        } else {
          this.setState({
            tabcData: tabcData
          });
        }
      })
      .catch(err => console.log(err));
  }
  createBarChart() {
    var data=[0,0,0,0,0,0,0,0,0,0];
    const node= this.node;
    for(var i=0; i<10; i++){
      for(var j=0; j<this.state.tabcData.length; j++){
        if(this.state.tabcData[j].rating===i/2){
          data[i]++;
        }
      }
    }
    console.log(data);
    var yScale = scaleLinear()
      .domain([0, 50])
      .range([500, 0]);
    var xScale = scaleLinear()
      .domain([0, 5])
      .range([0, 500]);

      //X Label
      select(node)
        .append('text')
        .attr('x',500/2)
        .attr('y',500+35)
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text("Yelp Rating")
        .attr('transform', 'translate(560,40)');

      //Y Label
      select(node)
        .append('text')
        .attr('x',500/2-40)
        .attr('y',15)
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text("Number of bars")
        .attr('transform', 'translate(540,40)')
        .attr('transform', 'rotate(-90)');

      //Y axis
      select(node)
        .append('g')
        .attr('class', 'axis')
        .call(axisLeft(yScale))
        .attr('transform', 'translate(560,40)');

      //X axis
      select(node)
        .append('g')
        .attr('class', 'axis')
        .call(axisBottom(xScale).ticks(10))
        .attr('transform', 'translate(560,240)');

      select(node)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('d',data)
        .attr('x', (d,i) => i*50)
        .attr('y', 500)
        .attr('height', (d,i)=>yScale(d))
        .attr('width', 45)
        .attr("fill", "green");
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
    console.log(this.state.tabcData);
    if(this.state.tabcData&&this.state.incidentData){
      this.createPieChart();

      this.createBarChart();

    return (
        <Basic>
          <PieChart/>
          <BarChart/>
          <SmoothChart/>
        </Basic>
    );
  } else {
    return(
      <div/>
    )
  }}
}
export default D3Vis;
