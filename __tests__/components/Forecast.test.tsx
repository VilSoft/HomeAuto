// Interaction test for Forecast — hover toggles day/night content
//
// NEW TOOL: fireEvent
//   Used for DOM events that userEvent doesn't cover (mouseOver/mouseOut).
//   fireEvent.mouseOver(el) fires the DOM 'mouseover' event. React's
//   onMouseOver catches it via bubbling — so firing on any child element
//   also triggers the handler on a parent.
//
//   userEvent.hover() exists but under the hood calls fireEvent.mouseMove +
//   fireEvent.mouseEnter. The component uses onMouseOver (not onMouseEnter)
//   so fireEvent.mouseOver is the direct match.
//
// WHY container.firstChild:
//   The card is a plain <div> (framer-motion mock). Divs have no ARIA role
//   so getByRole() won't find it. render() returns `container` — the DOM
//   node wrapping the component. container.firstChild is the outermost
//   element, which is where onMouseOver and onMouseOut are attached.
//
// STRUCTURAL TYPING:
//   ForecastPeriod is not exported from the component. TypeScript uses
//   structural (duck) typing — any object with the right shape works.
//   No import needed; just define the data inline.

import { render, screen, fireEvent } from '@testing-library/react'
import Forecast from '@/components/Forecast'

// ForecastPeriod shape (matches the component's local interface)
type ForecastPeriod = {
  name: string
  shortForecast: string
  temperature: number
  icon: string
  isDaytime: boolean
}

const dayPeriod: ForecastPeriod = {
  name: 'This Afternoon',
  shortForecast: 'Sunny',
  temperature: 72,
  icon: 'https://api.weather.gov/icons/land/day/skc?size=medium',
  isDaytime: true,
}

const nightPeriod: ForecastPeriod = {
  name: 'Tonight',
  shortForecast: 'Clear',
  temperature: 58,
  icon: 'https://api.weather.gov/icons/land/night/skc?size=medium',
  isDaytime: false,
}

describe('Forecast', () => {
  // --- Default (no hover) state shows day[0] ---

  it('shows day period name by default', () => {
    render(<Forecast day={[dayPeriod, nightPeriod]} />)
    expect(screen.getByText('This Afternoon')).toBeInTheDocument()
  })

  it('shows day period temperature by default', () => {
    render(<Forecast day={[dayPeriod, nightPeriod]} />)
    expect(screen.getByText('72°')).toBeInTheDocument()
  })

  it('shows day period forecast text by default', () => {
    render(<Forecast day={[dayPeriod, nightPeriod]} />)
    expect(screen.getByText('Sunny')).toBeInTheDocument()
  })

  // --- Hover state shows day[1] ---
  //
  // fireEvent.mouseOver fires DOM 'mouseover' on the card element.
  // React's onMouseOver handler calls setHover(true).
  // React re-renders synchronously — no await needed.

  it('switches to night period on mouse over', () => {
    const { container } = render(<Forecast day={[dayPeriod, nightPeriod]} />)
    const card = container.firstChild as HTMLElement

    fireEvent.mouseOver(card)

    expect(screen.getByText('Tonight')).toBeInTheDocument()
    expect(screen.getByText('58°')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('hides day content while hovered', () => {
    const { container } = render(<Forecast day={[dayPeriod, nightPeriod]} />)
    fireEvent.mouseOver(container.firstChild as HTMLElement)

    expect(screen.queryByText('This Afternoon')).not.toBeInTheDocument()
    expect(screen.queryByText('72°')).not.toBeInTheDocument()
  })

  // --- Mouse out reverts to day[0] ---

  it('reverts to day period on mouse out', () => {
    const { container } = render(<Forecast day={[dayPeriod, nightPeriod]} />)

    fireEvent.mouseOver(container.firstChild as HTMLElement)
    expect(screen.getByText('Tonight')).toBeInTheDocument()

    // Re-read container.firstChild after re-render — the DOM node reference
    // may have changed when React reconciled the component tree.
    fireEvent.mouseOut(container.firstChild as HTMLElement)
    expect(screen.getByText('This Afternoon')).toBeInTheDocument()
    expect(screen.queryByText('Tonight')).not.toBeInTheDocument()
  })

  // --- Icon alt reflects current period ---
  //
  // next/jest mocks next/image as a plain <img>. The alt attribute comes
  // from current.shortForecast, so it changes on hover too.

  it('image alt matches the current forecast', () => {
    const { container } = render(<Forecast day={[dayPeriod, nightPeriod]} />)
    expect(screen.getByRole('img', { name: 'Sunny' })).toBeInTheDocument()

    fireEvent.mouseOver(container.firstChild as HTMLElement)
    expect(screen.getByRole('img', { name: 'Clear' })).toBeInTheDocument()
  })
})
