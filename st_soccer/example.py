import streamlit as st
from kloppy import metrica
from st_soccer import TrackingComponent

BLUE = "#2b83ba"
RED = "#d7191c"


def get_sample_data(limit=1000):

    dataset = metrica.load_tracking_csv(
        home_data="https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Home_Team.csv",
        away_data="https://raw.githubusercontent.com/metrica-sports/sample-data/master/data/Sample_Game_1/Sample_Game_1_RawTrackingData_Away_Team.csv",
        limit=limit,
        coordinates="metrica",
    )

    frames = []
    home_team = dataset.metadata.teams[0]
    for f in dataset.frames:
        frame_data = []
        for player, coordinates in f.players_coordinates.items():
            attrs = {
                "x": coordinates.x,
                "y": coordinates.y,
                "team": "home" if player.team == home_team else "away",
            }
            frame_data.append(attrs)

        try:
            ball_x, ball_y = f.ball_coordinates.x, f.ball_coordinates.y
            attrs = {
                "x": ball_x,
                "y": ball_y,
                "team": "ball",
            }
            frame_data.append(attrs)
        except AttributeError:
            pass  # No ball coordinates

        frames.append(frame_data)

    return frames


st.set_page_config(page_title="Tactics Board", page_icon=":soccer:")
if __name__ == "__main__":
    frames = get_sample_data()

    st.markdown("## `streamlit-soccer`")
    st.caption("[Source Code](https://github.com/devinpleuler/streamlit-soccer)")

    tc = TrackingComponent(frames=frames, home_color=RED, away_color=BLUE, loop="yes")

    st.markdown(
        """        
        ## What is this?
        
        This is a custom react component for [Streamlit](https://streamlit.io/) that allows you to display soccer tracking data.
        
        It is built on top of `d3-soccer` by [Pieter Robberects](https://bsky.app/profile/probberechts.bsky.social), and the animation logic is mostly lifted from his lovely [Observable notebook](https://observablehq.com/@probberechts/animating-tracking-data).
        
        The sample data is sourced from the [Metrica Sports Sample Data](https://github.com/metrica-sports/sample-data) repository, and the example code utilizes the [`kloppy`](https://kloppy.pysport.org/) library to load the data.
        
        The component is built from Streamlit's `component-template` repository.

        Since it's all open-source, it's easy to deploy to Streamlit Community Cloud.
        
        ## How to use it?
        
        It's still a bit fragile, and currently on release version `0.0.1`.
        
        Would absolutely love community help building it out to add additional features. Pull Requests (and) very welcome.
        
        To install the component, run the following command:
        ```bash
        pip install streamlit-soccer
        ```
        
        In python, with streamlit, you can do the following:
        ```python
        import streamlit as st
        from st_soccer import TrackingComponent
        
        frames = [
            [
                {"x": 0, "y": 0, "team": "home"},
                {"x": 10, "y": 10, "team": "away"},
                {"x": 20, "y": 20, "team": "ball"},
                ...
            ], 
            ...
        ]
        
        tc = TrackingComponent(
            frames=frames, 
            home_color="#d7191c", 
            away_color="#2b83ba", 
            loop="yes")
        ```
        """
    )
