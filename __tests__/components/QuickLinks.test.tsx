// Integration test for QuickLinks — admin/regular service split
//
// NEW CONCEPT: testing DOM order with compareDocumentPosition
//   Elements don't have an "index" you can check. The DOM API method
//   compareDocumentPosition() returns a bitmask describing the relationship
//   between two nodes.
//
//   node.compareDocumentPosition(other)
//   Returns 4 (DOCUMENT_POSITION_FOLLOWING) when `other` comes AFTER `node`
//   Returns 2 (DOCUMENT_POSITION_PRECEDING) when `other` comes BEFORE `node`
//
//   Example: jellyfinLink.compareDocumentPosition(adminHeading) === 4
//   → adminHeading is after jellyfinLink in the document. That's correct —
//     regular services should appear before the Admin section.
//
// USES REAL services DATA:
//   QuickLinks reads from the `services` array directly (no props).
//   Real data: Jellyfin, Kassies Recipes, Kassies Crochet = regular
//              Pi-hole, Portainer = admin
//   Tests reflect actual content — if you add a new service, tests still pass
//   as long as the section structure is correct.

import { render, screen } from '@testing-library/react'
import QuickLinks from '@/components/QuickLinks'

describe('QuickLinks', () => {
  // --- Headings ---

  it('renders the Self-Hosted Services heading', () => {
    render(<QuickLinks />)
    expect(screen.getByRole('heading', { name: /self-hosted services/i })).toBeInTheDocument()
  })

  it('renders the Admin heading', () => {
    render(<QuickLinks />)
    // There are two h2 elements — { name } filter selects the right one
    expect(screen.getByRole('heading', { name: /^admin$/i })).toBeInTheDocument()
  })

  // --- Services visible ---

  it('renders regular services as links', () => {
    render(<QuickLinks />)
    expect(screen.getByRole('link', { name: /jellyfin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kassies recipes/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /kassies crochet/i })).toBeInTheDocument()
  })

  it('renders admin services as links', () => {
    render(<QuickLinks />)
    expect(screen.getByRole('link', { name: /pi-hole/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /portainer/i })).toBeInTheDocument()
  })

  // --- DOM order ---

  it('regular services appear before the Admin heading', () => {
    render(<QuickLinks />)
    const jellyfinLink = screen.getByRole('link', { name: /jellyfin/i })
    const adminHeading = screen.getByRole('heading', { name: /^admin$/i })

    // DOCUMENT_POSITION_FOLLOWING (4): adminHeading comes after jellyfinLink
    expect(jellyfinLink.compareDocumentPosition(adminHeading))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('admin services appear after the Admin heading', () => {
    render(<QuickLinks />)
    const adminHeading = screen.getByRole('heading', { name: /^admin$/i })
    const piholeLink = screen.getByRole('link', { name: /pi-hole/i })

    // DOCUMENT_POSITION_FOLLOWING (4): piholeLink comes after adminHeading
    expect(adminHeading.compareDocumentPosition(piholeLink))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
