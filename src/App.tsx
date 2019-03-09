import styled from "@emotion/styled"
import React, { useCallback, useEffect, useReducer } from "react"
import randomRange from "./randomRange"
import sample from "./sample"

type GameState = {
  panels: PanelState[]
  score: number
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
  score: 0,
}

type Action = { type: string; [key: string]: any }

const updatePanelState = (
  state: GameState,
  key: PanelState["key"],
  panelState: PanelState["state"],
) => ({
  ...state,
  panels: state.panels.map<PanelState>((panel) => {
    return panel.key !== key ? panel : { ...panel, state: panelState }
  }),
})

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "showGood":
      return updatePanelState(state, action.key, "good")

    case "showBad":
      return updatePanelState(state, action.key, "bad")

    case "hidePanel":
      return updatePanelState(state, action.key, "off")

    case "scored": {
      const panel = state.panels.find((panel) => panel.key === action.key)
      if (!panel) throw new Error(`unexpected panel key "${action.key}"`)

      const scoreDelta: Record<PanelState["state"], number> = {
        good: 1,
        bad: -1,
        off: 0,
      }

      return {
        ...updatePanelState(state, action.key, "off"),
        score: state.score + scoreDelta[panel.state],
      }
    }

    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const showTile = useCallback(() => {
    const [randomTile] = sample(
      state.panels.filter((panel) => panel.state === "off"),
    )

    if (Math.random() > 0.35) {
      dispatch({ type: "showGood", key: randomTile.key })
    } else {
      dispatch({ type: "showBad", key: randomTile.key })
    }

    setTimeout(() => {
      dispatch({ type: "hidePanel", key: randomTile.key })
    }, randomRange(1000, 2000))

    setTimeout(showTile, randomRange(500, 2000))
  }, [state])

  useEffect(() => {
    showTile()
  }, [])

  return (
    <Main>
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
            onClick={() => dispatch({ type: "scored", key: panel.key })}
          />
        ))}
      </PanelGrid>
      <ScoreDisplay>score: {state.score}</ScoreDisplay>
    </Main>
  )
}

export default App

const Main = styled.main`
  padding: 10rem 0;

  display: grid;
  grid-gap: 2rem;
`

const PanelGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, auto);
  justify-content: center;
  align-content: center;
  grid-gap: 1rem;
`

const Panel = styled.button`
  width: 100px;
  height: 100px;
  background-color: gray;
`

const ScoreDisplay = styled.p`
  font: 32px "Roboto Condensed", sans-serif;
  font-weight: lighter;
  text-align: center;
`
