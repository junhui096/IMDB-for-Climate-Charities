import React, { Component } from 'react';
import axios from 'axios';
import {scaleLinear } from 'd3-scale';
import { interpolateBrBG } from 'd3-scale-chromatic'
import { axisLeft, axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state= {
      tabcData:[]
    }
  }

  componentDidMount() {

    const url2 =
      'http://api.leavethekeys.me/tabc';

    axios
      .get(url2)
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
    for(var i=0; i<=10; i++){
      for(var j=0; j<this.state.tabcData.length; j++){
        if(this.state.tabcData[j].rating===i/2){
          data[i-1]++;
        }
      }
    }
    console.log(data);
    var yScale = scaleLinear()
      .domain([0, 50])
      .range([450, 0]);
    var xScale = scaleLinear()
      .domain([0, 5])
      .range([0, 450]);

      //X Label
      select(node)
        .append('text')
        .attr('x',250)
        .attr('y',470)
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text("Yelp Rating")
        .attr('transform', 'translate(30,20)');

      //Y Label
      select(node)
        .append('text')
        .attr('x',-250)
        .attr('y',15)
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .text("Number of bars")
        .attr('transform', 'translate(0,0)')
        .attr('transform', 'rotate(-90)');

      //Y axis
      select(node)
        .append('g')
        .attr('class', 'axis')
        .call(axisLeft(yScale))
        .attr('transform', 'translate(40,5)');

      //X axis
      select(node)
        .append('g')
        .attr('class', 'axis')
        .call(axisBottom(xScale).ticks(11))
        .attr('transform', 'translate(40,455)');

        select(node)
           .selectAll('rect')
           .data(data)
           .enter()
           .append('rect')
           .append('g')

        select(node)
           .selectAll('rect')
           .data(data)
           .exit()
           .remove()

      select(node)
        .selectAll('rect')
        .data(data)
        .attr('x', (d,i) => xScale(i/2))
        .attr('y', (d,i) => yScale(d))
        .attr('height', (d,i)=>450-yScale(d))
        .attr('width', 30)
        .attr("fill", (d,i)=>interpolateBrBG(i/10))
        .attr('transform','translate(70,5)');
  }
  render() {
    this.createBarChart();
    return (
      <div>
          <h1 className="mt-5">Average Yelp Ratings of Bars</h1>
          <svg className="m-5"
            ref={node => (this.node = node)}
            width={550}
            height={500}
          />
      </div>
    );
  }
}
export default BarChart;
