import os
import json
import streamlit.components.v1 as components

parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")
component = components.declare_component("st_soccer", path=build_dir)


def TrackingComponent(frames, key=None, animate=True, **kwargs):
    return component(frames=json.dumps(frames), animate=animate, key=key, **kwargs)
