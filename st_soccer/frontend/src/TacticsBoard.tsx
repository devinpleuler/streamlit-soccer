// MyComponent.tsx
import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, {
  ReactElement,
  useEffect,
  useState,
  useRef
} from "react"

import * as d3 from "d3"
import * as d3Soccer from "d3-soccer"


function TacticsBoard({ args, disabled, theme }: ComponentProps): ReactElement {

  const [homeColor, setHomeColor] = useState("pink")
  const [awayColor, setAwayColor] = useState("orange")  

  const data = JSON.parse(args['name'])
  const trackingData = data['frames']
  const pitchRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    setHomeColor(data['home_color'])
    setAwayColor(data['away_color'])
  }, [args])


  useEffect(() => {
    if (!pitchRef.current) return

    d3.select(pitchRef.current).selectAll("*").remove()
    const _pitch = d3Soccer.pitch().height(450).pitchStrokeWidth(0.3)
    const pitch = d3.select(pitchRef.current).call(_pitch).style("background-color", "white")
    const frameRate = 30 //fps

    const plot_layer = pitch.select(".above")

    let x = d3.scaleLinear().domain([0, 1]).range([0, 105]);
    let y = d3.scaleLinear().domain([0, 1]).range([0, 68]);

    function updateData(frame: any): void {
      let frameData = trackingData.filter((d: any) => d.frame == frame);

      let u = plot_layer.selectAll('circle')
      .data(frameData, (d: any) => parseInt(d.player) || 0);
      u.enter().append('circle')
      .attr('cx', (d: any) => x(parseFloat(d.x)))
      .attr('cy', (d: any) => y(parseFloat(d.y)))
      .attr('r', (d: any) => d.team === 'ball' ? 0.5 : 1.1)
      .attr('class', (d: any) => d.team === 'ball' ? 'ball' : 'player')
      .attr('fill', (d: any) => d.team === 'ball' ? 'yellow' : (d.team === 'home' ? homeColor : awayColor))
      .attr('stroke', 'black')
      .attr('stroke-width', .2)
      u.attr('cx', (d: any) => x(parseFloat(d.x)))
      .attr('cy', (d: any) => y(parseFloat(d.y)))
      u.exit().remove();

    }

    let frames = d3.max(trackingData, (d: any) => parseInt(d.frame));
    var i = 0
    setInterval(function(){
        i = i === frames ? 0 : i + 1;
        updateData(i)
    }, 1000/frameRate);

    Streamlit.setFrameHeight()
  }, [homeColor, awayColor])

  return (
    <div ref={pitchRef} />
  )
}

export default withStreamlitConnection(TacticsBoard)