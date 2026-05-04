// Interaction + async test for DDGSearch
//
// WHAT THIS DEMONSTRATES:
// Testing components that respond to user input and make network requests.
// Two new tools appear here: userEvent (realistic typing) and fake timers
// (control setTimeout debounce without actually waiting).
//
// KEY CONCEPTS:
//
// userEvent.setup({ delay: null })
//   Simulates user behavior at a higher level than fireEvent. Typing fires
//   keydown + keypress + input + keyup events per character — like a real
//   user. delay:null disables real async delays that would conflict with
//   jest.useFakeTimers().
//
// jest.fn().mockResolvedValue(x)
//   Creates a spy that records every call AND returns a resolved Promise.
//   The component calls fetch() normally — it doesn't know it's mocked.
//
// jest.useFakeTimers() / jest.runAllTimers()
//   Replaces setTimeout/setInterval with synchronous fakes. Without this
//   you'd actually wait 150ms for the debounce. runAllTimers() fires all
//   pending timers instantly regardless of their delay value.
//
// waitFor(() => expect(...))
//   Retries the assertion every 50ms until it passes or 1000ms timeout.
//   Use when state updates happen after async operations (fetch, timers).
//
// expect.stringContaining() / expect.objectContaining()
//   Asymmetric matchers — assert "this was somewhere in the argument"
//   without requiring exact match.

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DDGSearch from '@/components/DDGSearch'

const mockSuggestions = [
  { phrase: 'typescript tutorial' },
  { phrase: 'typescript handbook' },
]

const originalFetch = global.fetch

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockSuggestions),
  } as any)
  jest.useFakeTimers()
})

afterEach(() => {
  global.fetch = originalFetch
  jest.useRealTimers()
})

describe('DDGSearch', () => {
  it('renders the search input', () => {
    render(<DDGSearch />)
    expect(screen.getByPlaceholderText(/search duckduckgo/i)).toBeInTheDocument()
  })

  it('updates input value as user types', async () => {
    const user = userEvent.setup({ delay: null })
    render(<DDGSearch />)
    await user.type(screen.getByPlaceholderText(/search duckduckgo/i), 'typescript')
    expect(screen.getByPlaceholderText(/search duckduckgo/i)).toHaveValue('typescript')
  })

  it('does not fetch before the debounce fires', async () => {
    const user = userEvent.setup({ delay: null })
    render(<DDGSearch />)
    await user.type(screen.getByPlaceholderText(/search duckduckgo/i), 'typescript')
    // timers haven't fired yet — fetch should not have been called
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('calls fetch with the encoded query after the debounce fires', async () => {
    const user = userEvent.setup({ delay: null })
    render(<DDGSearch />)
    await user.type(screen.getByPlaceholderText(/search duckduckgo/i), 'typescript')
    jest.runAllTimers()
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=typescript'),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })
  })

  it('shows suggestion items after fetch resolves', async () => {
    const user = userEvent.setup({ delay: null })
    render(<DDGSearch />)
    await user.type(screen.getByPlaceholderText(/search duckduckgo/i), 'typescript')
    jest.runAllTimers()
    await waitFor(() => {
      expect(screen.getByText('typescript tutorial')).toBeInTheDocument()
      expect(screen.getByText('typescript handbook')).toBeInTheDocument()
    })
  })

  it('hides suggestions when Escape is pressed', async () => {
    const user = userEvent.setup({ delay: null })
    render(<DDGSearch />)
    await user.type(screen.getByPlaceholderText(/search duckduckgo/i), 'typescript')
    jest.runAllTimers()
    await waitFor(() => expect(screen.getByText('typescript tutorial')).toBeInTheDocument())
    await user.keyboard('{Escape}')
    expect(screen.queryByText('typescript tutorial')).not.toBeInTheDocument()
  })
})
