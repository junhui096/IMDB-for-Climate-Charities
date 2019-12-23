import React, { Component } from 'react';
//import './App.css'
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { curveBundle, line } from 'd3-shape';
import { interpolateCool } from 'd3-scale-chromatic';
import axios from 'axios';

class SmoothChart extends Component {
  constructor(props) {
    super(props);
    this.state={
      incidentData: []
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






  createSmoothChart() {
    var data=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<this.state.incidentData.length; i++){
      data[(Math.floor(this.state.incidentData[i].Time/100)+10)%24]++;
    }
    console.log(data);
    //Create linear scales to graph on
    var yScale = scaleLinear()
      .domain([0, .15])
      .range([450, 0]);
    var xScale = scaleLinear()
      .domain([0, 24])
      .range([0, 450]);

    //Compose line generators for the graph based on the data format
    var lineGenerator=function(b) { return line()
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d/100))
        .curve(curveBundle.beta(b));}

    const node = this.node;

    //Y axis
    select(node)
      .append('g')
      .attr('class', 'axis')
      .call(axisLeft(yScale))
      .attr('transform', 'translate(60,10)');

    //X Label
    select(node)
      .append('text')
      .attr('x',450/2)
      .attr('y',450)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text("Hour of the Day")
      .attr('transform', 'translate(50,45)');

    //Y Label
    select(node)
      .append('text')
      .attr('x',-250)
      .attr('y',15)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text("Percentage of DWIs")
      .attr('transform', 'translate(40,15)')
      .attr('transform', 'rotate(-90)');

    //X axis
    select(node)
      .append('g')
      .attr('class', 'axis')
      .call(axisBottom(scaleLinear().domain([10,23]).range([0,450*13/24])).ticks(14))
      .attr('transform', 'translate(60,460)');

    select(node)
      .append('g')
      .attr('class', 'axis')
      .call(axisBottom(scaleLinear().domain([0,10]).range([450*14/24,450])).ticks(10))
      .attr('transform', 'translate(60,460)');

    xScale = scaleLinear()
        .domain([0, 24])
        .range([0, 450]);
    select(node)
      .selectAll('path,line,text')
      .style('stroke', '#bbbbbb');

    //Line
    for(var j=0; j<15; j++){
      select(node)
        .append('g')
        .append('path')
        .attr('d', lineGenerator(1-j/14)(data))
        .style('fill', interpolateCool(j/20))
        .style('stroke', interpolateCool(j/20))
        .attr('transform', 'translate(60,10)');
    }
  }


  render() {
    this.createSmoothChart();
    return (
        <div>
          <h1 className="mt-5">Frequency of DWIs by hour</h1>
          <svg className="m-5"
            ref={node => (this.node = node)}
            width={500}
            height={500}
          />
        </div>
    );
  }
}
export default SmoothChart;
