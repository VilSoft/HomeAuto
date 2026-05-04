// Tests the conditional Admin section using jest.mock
//
// NEW CONCEPT: jest.mock — module-level data replacement
//   QuickLinks imports `services` directly from Service.tsx (no props).
//   To control what it renders, replace the entire module with fake data.
//
//   jest.mock(modulePath, factory)
//   - factory function returns the fake module (same shape as real module)
//   - Jest HOISTS this call to the top of the file automatically —
//     it runs before any imports, so the mock is in place when the
//     component module loads
//   - Affects ALL tests in this file (why this lives in its own file)
//
//   Path uses the @/ alias — Jest resolves it the same way as the component's
//   relative import `./Service`, so the mock intercepts correctly.
//
// SEPARATE FILE because jest.mock is file-scoped:
//   If we put this in QuickLinks.test.tsx alongside the real-data tests,
//   the mock would break those tests. Separate file = separate mock scope.

import { render, screen } from '@testing-library/react'
import QuickLinks from '@/components/QuickLinks'

jest.mock('@/components/Service', () => ({
  services: [
    {
      id: 'jellyfin',
      name: 'Jellyfin',
      description: 'Media server',
      url: 'http://jellyfin.server0.home',
      icon: '/icons/links/jellyfin.svg',
    },
  ],
}))

describe('QuickLinks — no admin services', () => {
  it('hides the Admin heading when no admin services exist', () => {
    render(<QuickLinks />)
    // queryByRole returns null (not throws) when not found
    expect(screen.queryByRole('heading', { name: /^admin$/i })).not.toBeInTheDocument()
  })

  it('still renders regular services', () => {
    render(<QuickLinks />)
    expect(screen.getByRole('link', { name: /jellyfin/i })).toBeInTheDocument()
  })

  it('still renders the Self-Hosted Services heading', () => {
    render(<QuickLinks />)
    expect(screen.getByRole('heading', { name: /self-hosted services/i })).toBeInTheDocument()
  })
})
