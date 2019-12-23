import React, { Component } from 'react';
//import './App.css'
import { axisLeft, axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { select } from 'd3-selection';
import { line } from 'd3-shape';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.createLineChart = this.createLineChart.bind(this);
  }

  componentDidMount() {
    if(this.props.data&&this.props.data.length !== 0&&true){
        this.createLineChart();
    } else {
        this.createErrorChart();
    }
  }


  getChartData(){
    var chartData={};
    //Find min and max dates of available data
    var mindate, maxdate, values;
    if(this.props.format === 'year'){
        mindate = min(this.props.data.slice(0))[0];
        maxdate = max(this.props.data.slice(0))[0];
        //Get raw array of displayed data, rather than weird grouped-with-year format
        values = this.props.data.map(function(f) {return f[1];});


    } else{
        mindate = min(this.props.data.slice(0))[0];
        maxdate = max(this.props.data.slice(1))[0];
        //Get raw array of displayed data, rather than weird grouped-with-year format
        values= this.props.data.map(function(f) {return f[2];});

    }

    //Determine minimum of raw displayed data to find lower bound for graph
    var dataMin = Math.min.apply(null,values);
    var dataMax = Math.max.apply(null,values);

    dataMin=(dataMin>0?dataMin*.8:dataMin*1.2);
    dataMax=(dataMax>0?dataMax*1.2:dataMax*.8);

    //Determine maximum of raw displayed data to find upper bound for graph

    //Create linear scales to graph on
    chartData.yScale = scaleLinear()
      .domain([dataMin, dataMax])
      .range([this.props.size[1], 0]);
    chartData.xScale = scaleLinear()
      .domain([mindate, maxdate])
      .range([0, this.props.size[0]]);

    //Compose line generators for the graph based on the data format
    if(this.props.format === 'year'){
      chartData.lineGenerator= line()
        .x((d, i) => chartData.xScale(d[0]))
        .y((d, i) => chartData.yScale(d[1]));
    } else{
      chartData.lineGenerator = line()
        .x((d, i) => chartData.xScale(d[0]))
        .y((d, i) => chartData.yScale(d[2]));
    }
    return chartData;
  }

  createLineChart() {
    var chartData=this.getChartData();
    const node = this.node;

    //Y axis
    select(node)
      .append('g')
      .attr('class', 'axis')
      .call(axisLeft(chartData.yScale))
      .attr('transform', 'translate(60,40)');

    //X Label
    select(node)
      .append('text')
      .attr('x',this.props.size[0]/2)
      .attr('y',this.props.size[1]+35)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text(this.props.xlabel)
      .attr('transform', 'translate(60,40)');

    //Y Label
    select(node)
      .append('text')
      .attr('x',-this.props.size[1]/2-40)
      .attr('y',15)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text(this.props.ylabel)
      .attr('transform', 'translate(40,40)')
      .attr('transform', 'rotate(-90)');

    //X axis
    select(node)
      .append('g')
      .attr('class', 'axis')
      .call(axisBottom(chartData.xScale).ticks(8))
      .attr('transform', 'translate(60,240)');

    select(node)
      .selectAll('path,line,text')
      .style('stroke', '#bbbbbb');

    //Line
    select(node)
      .append('g')
      .append('path')
      .attr('d', chartData.lineGenerator(this.props.data))
      .style('fill', 'none')
      .style('stroke', this.props.color)
      .attr('transform', 'translate(60,40)');
  }

  createErrorChart() {
    const node=this.node;

    select(node)
      .append('text')
      .attr('x',this.props.size[0]/2)
      .attr('y',this.props.size[1]/2)
      .style('fill','#bbbbbb')
      .style('font-size','50px')
      .text("No data found")
      .attr('transform','translate(-120,40)');
  }

  render() {
    return (
      <div className="card bg-dark m-3">
        <div className="card-header bg-info">
          <h5>{this.props.name}</h5>
        </div>
        <div className="card-body mt-3">
          <svg
            ref={node => (this.node = node)}
            width={this.props.size[0] + 80}
            height={this.props.size[1] + 80}
          />
        </div>
      </div>
    );
  }
}
export default LineChart;
