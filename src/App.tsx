import styled from "@emotion/styled"
import React, { useEffect, useReducer } from "react"
import randomRange from "./randomRange"
import range from "./range"
import sample from "./sample"
import wait from "./wait"

const panelCount = 8

type GameState = {
  targets: TargetState[]
  score: number
}

type TargetState = {
  key: number
  panel?: number
}

const initialState: GameState = {
  targets: [{ key: 0, panel: undefined }],
  score: 0,
}

type Action = { type: string; [key: string]: any }

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "findPanel":
      return {
        ...state,
        targets: state.targets.map<TargetState>((target) => {
          if (target.key !== action.key) return target

          const [newPanel] = sample(
            range(panelCount).filter((n) =>
              state.targets.some((target) => target.panel !== n),
            ),
          )

          return { ...target, panel: newPanel }
        }),
      }

    case "hide":
      return {
        ...state,
        targets: state.targets.map<TargetState>((target) => {
          if (target.key !== action.key) return target
          return { ...target, panel: undefined }
        }),
      }

    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const runTargetLoop = async (targetKey: number) => {
    while (true) {
      await wait(randomRange(1000, 2000))

      dispatch({ type: "findPanel", key: targetKey })

      await wait(randomRange(1000, 2000))

      dispatch({ type: "hide", key: targetKey })
    }
  }

  useEffect(() => {
    runTargetLoop(0)
  }, [])

  return (
    <Main>
      <PanelGrid>
        {range(panelCount).map((n) => (
          <Panel
            key={n}
            style={{
              backgroundColor: state.targets.some(
                (target) => target.panel === n,
              )
                ? "green"
                : undefined,
            }}
            // onClick={() => dispatch({ type: "scored", key: panel.key })}
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
