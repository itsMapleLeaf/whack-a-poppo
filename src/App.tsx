import styled from "@emotion/styled"
import React, { useReducer } from "react"
import randomRange from "./randomRange"
import range from "./range"
import sample from "./sample"
import useInterval from "./useInterval"

const panelCount = 8
const tickPeriodMs = 100

type GameState = {
  targets: TargetState[]
  score: number
}

type TargetState = {
  key: number
  panel?: number
  actionTicks: number
}

const initialState: GameState = {
  targets: [
    {
      key: 0,
      panel: undefined,
      actionTicks: Math.floor(randomRange(10, 20)),
    },
    {
      key: 1,
      panel: undefined,
      actionTicks: Math.floor(randomRange(10, 20)),
    },
    {
      key: 2,
      panel: undefined,
      actionTicks: Math.floor(randomRange(10, 20)),
    },
    {
      key: 3,
      panel: undefined,
      actionTicks: Math.floor(randomRange(10, 20)),
    },
    {
      key: 4,
      panel: undefined,
      actionTicks: Math.floor(randomRange(10, 20)),
    },
  ],
  score: 0,
}

type Action = { type: string; [key: string]: any }

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "tick": {
      // allowed to be mutated, is internal
      const unoccupiedPanels = new Set(range(panelCount))

      for (const target of state.targets) {
        if (target.panel != null) {
          unoccupiedPanels.delete(target.panel)
        }
      }

      return {
        ...state,
        targets: state.targets.map<TargetState>((target) => {
          // if we still have ticks, decrement them
          if (target.actionTicks > 0) {
            return {
              ...target,
              actionTicks: target.actionTicks - 1,
            }
          }

          // once the ticks hit 0, we need to do something

          // no panel? find one
          if (target.panel === undefined) {
            const [newPanel] = sample(unoccupiedPanels)

            // if all panels are occupied, do nothing
            if (newPanel == null) return target

            unoccupiedPanels.delete(newPanel)

            return {
              ...target,
              panel: newPanel,
              actionTicks: randomRange.int(10, 20),
            }
          }

          // have a panel? hide
          return {
            ...target,
            panel: undefined,
            actionTicks: randomRange.int(10, 20),
          }
        }),
      }
    }

    case "hit": {
      const hitTarget = state.targets.find(
        (target) => target.panel === action.panel,
      )

      if (!hitTarget) return state

      return {
        ...state,
        targets: state.targets.map<TargetState>((target) =>
          target !== hitTarget
            ? target
            : {
                ...target,
                panel: undefined,
                actionTicks: randomRange.int(10, 20),
              },
        ),
        score: state.score + 1,
      }
    }

    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useInterval(() => dispatch({ type: "tick" }), tickPeriodMs)

  const getPanelStyle = (panel: number) => {
    const hasTarget = state.targets.some((target) => target.panel === panel)
    return {
      backgroundColor: hasTarget ? "green" : undefined,
    }
  }

  return (
    <Main>
      <PanelGrid>
        {range(panelCount).map((panel) => (
          <Panel
            key={panel}
            style={getPanelStyle(panel)}
            onClick={() => dispatch({ type: "hit", panel })}
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
