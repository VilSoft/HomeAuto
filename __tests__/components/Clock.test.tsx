// Redux integration + timer/Date mocking test for Clock
//
// WHAT THIS DEMONSTRATES:
// Testing components connected to Redux. Clock reads timezone from the store
// and formats dates — this test proves the full chain works end-to-end.
//
// KEY CONCEPTS:
//
// renderWithStore(ui, { preloadedState })
//   Custom helper that wraps render() with a real Redux <Provider>.
//   preloadedState sets initial store state without dispatching actions —
//   the "arrange" phase of the test.
//
// jest.useFakeTimers({ now: date })
//   Freezes new Date() at a known timestamp so time-based assertions are
//   deterministic. Without this, "what time does the clock show?" changes
//   every millisecond and tests become flaky.
//   jest.advanceTimersByTime(ms) fires pending timers AND advances Date.now().
//
// waitFor(() => expect(...))
//   Clock returns null until its useEffect runs (to avoid SSR hydration
//   mismatch). waitFor retries the assertion until the component shows content.
//
// act(() => { store.dispatch(...) })
//   Manual dispatches outside React event handlers need act() to tell React
//   "flush all state updates triggered by this code." RTL's user.click/type
//   do this automatically, but manual dispatches need it explicitly.
//
// FROZEN_DATE: 2026-05-01T10:30:45Z
//   America/New_York (EDT = UTC-4) → 6:30:45 AM
//   America/Chicago (CDT = UTC-5) → 5:30:45 AM

import { screen, act, waitFor } from '@testing-library/react'
import Clock from '@/components/Clock'
import { renderWithStore } from '../utils/renderWithStore'
import { setTimezone } from '@/redux/features/locationSlice'

const FROZEN_DATE = new Date('2026-05-01T10:30:45.000Z')

beforeEach(() => {
  jest.useFakeTimers({ now: FROZEN_DATE })
})

afterEach(() => {
  jest.useRealTimers()
})

describe('Clock', () => {
  it('renders the date in Eastern timezone', async () => {
    renderWithStore(<Clock />, {
      preloadedState: { locationReducer: { timezone: 'America/New_York' } },
    })
    await waitFor(() => expect(screen.getByText(/friday/i)).toBeInTheDocument())
    expect(screen.getByText(/may 1/i)).toBeInTheDocument()
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('renders correct time for Eastern timezone', async () => {
    renderWithStore(<Clock />, {
      preloadedState: { locationReducer: { timezone: 'America/New_York' } },
    })
    await waitFor(() => expect(screen.getByText(/6:30:45 AM/i)).toBeInTheDocument())
  })

  it('renders correct time for Chicago timezone', async () => {
    renderWithStore(<Clock />, {
      preloadedState: { locationReducer: { timezone: 'America/Chicago' } },
    })
    await waitFor(() => expect(screen.getByText(/5:30:45 AM/i)).toBeInTheDocument())
  })

  it('re-renders when timezone is changed via dispatch', async () => {
    const { store } = renderWithStore(<Clock />, {
      preloadedState: { locationReducer: { timezone: 'America/New_York' } },
    })
    await waitFor(() => expect(screen.getByText(/6:30:45 AM/i)).toBeInTheDocument())

    act(() => { store.dispatch(setTimezone('America/Chicago')) })

    await waitFor(() => expect(screen.getByText(/5:30:45 AM/i)).toBeInTheDocument())
  })

  it('advances the displayed time when the 1-second interval fires', async () => {
    renderWithStore(<Clock />, {
      preloadedState: { locationReducer: { timezone: 'America/New_York' } },
    })
    await waitFor(() => expect(screen.getByText(/6:30:45 AM/i)).toBeInTheDocument())

    act(() => { jest.advanceTimersByTime(1000) })

    await waitFor(() => expect(screen.getByText(/6:30:46 AM/i)).toBeInTheDocument())
  })
})
