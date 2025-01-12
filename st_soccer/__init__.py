import os
import streamlit.components.v1 as components

parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")
component = components.declare_component("st_soccer", path=build_dir)


def TrackingAnimator(name, key=None):
    return component(name=name, key=key, default=0)
