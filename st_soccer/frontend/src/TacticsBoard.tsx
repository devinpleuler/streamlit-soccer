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

  const [homeColor, setHomeColor] = useState("red")
  const [awayColor, setAwayColor] = useState("blue")  
  const [loop, setLoop] = useState("yes")
  const [frameRate, setFrameRate] = useState(30)

  const trackingData = JSON.parse(args['frames'])
  const pitchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (args['home_color']) setHomeColor(args['home_color'])
    if (args['away_color']) setAwayColor(args['away_color'])
    if (args['loop']) setLoop(args['loop'])
    if (args['frame_rate']) setFrameRate(args['frame_rate'])
  }, [args])


  useEffect(() => {
    if (!pitchRef.current) return

    d3.select(pitchRef.current).selectAll("*").remove()
    const _pitch = d3Soccer.pitch().height(450).pitchStrokeWidth(0.3)
    const pitch = d3.select(pitchRef.current).call(_pitch).style("background-color", "white")

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
      i = i === frames ? (loop === "yes" ? 0 : frames) : i + 1;
      updateData(i)
    }, 1000/frameRate);

    Streamlit.setFrameHeight()
  }, [homeColor, awayColor])

  return (
    <div ref={pitchRef} />
  )
}

export default withStreamlitConnection(TacticsBoard)