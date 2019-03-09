import styled from "@emotion/styled"
import React, { useEffect, useReducer } from "react"
import randomRange from "./randomRange"
import sample from "./sample"

type GameState = {
  panels: PanelState[]
}

type PanelState = {
  key: number
  state: "off" | "good" | "bad"
}

const initialState: GameState = {
  panels: [
    { key: 0, state: "off" },
    { key: 1, state: "off" },
    { key: 2, state: "off" },
    { key: 3, state: "off" },
    { key: 4, state: "off" },
    { key: 5, state: "off" },
    { key: 6, state: "off" },
    { key: 7, state: "off" },
  ],
}

type Action = { type: string; [key: string]: any }

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "showGood":
      return {
        ...state,
        panels: state.panels.map<PanelState>((panel) => {
          return panel.key !== action.key ? panel : { ...panel, state: "good" }
        }),
      }

    case "showBad":
      return {
        ...state,
        panels: state.panels.map<PanelState>((panel) => {
          return panel.key !== action.key ? panel : { ...panel, state: "bad" }
        }),
      }

    case "hidePanel":
      return {
        ...state,
        panels: state.panels.map<PanelState>((panel) => {
          return panel.key !== action.key ? panel : { ...panel, state: "off" }
        }),
      }

    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const showTile = () => {
      const [randomTile] = sample(
        state.panels.filter((panel) => panel.state === "off"),
      )

      if (Math.random() > 0.5) {
        dispatch({ type: "showGood", key: randomTile.key })
      } else {
        dispatch({ type: "showBad", key: randomTile.key })
      }

      setTimeout(() => {
        dispatch({ type: "hidePanel", key: randomTile.key })
      }, randomRange(1000, 2000))

      setTimeout(showTile, randomRange(500, 200))
    }

    showTile()
  }, [])

  return (
    <PanelGrid>
      {state.panels.map((panel) => (
        <Panel
          key={panel.key}
          style={{
            backgroundColor:
              panel.state === "good"
                ? "green"
                : panel.state === "bad"
                ? "red"
                : undefined,
          }}
        />
      ))}
    </PanelGrid>
  )
}

export default App

const PanelGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, auto);
  justify-content: center;
  align-content: center;
  grid-gap: 1rem;
  height: 100vh;
`

const Panel = styled.button`
  width: 100px;
  height: 100px;
  background-color: gray;
`
