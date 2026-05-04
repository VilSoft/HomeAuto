// Unit / rendering test for QuickLinkCard
//
// WHAT FRONTEND TESTS DO:
// They mount a React component into a fake browser DOM (jsdom) and assert
// that the output matches expectations — the right text appears, links point
// to the right URL, optional content shows or hides correctly.
//
// KEY RTL CONCEPTS:
//
// render(ui)
//   Mounts the component into jsdom. Returns query helpers, but use `screen`
//   instead — it always reflects the current DOM state.
//
// screen.getByRole(role, { name })
//   Gold-standard query. Finds elements by ARIA role + accessible name.
//   This is how screen readers see the page. If markup changes but semantic
//   meaning stays the same, the test still passes. If an <a> loses its href
//   it loses role="link" and the test catches it.
//   Common roles: 'link', 'button', 'heading', 'img', 'textbox'
//
// screen.queryByText(text)
//   Like getByText but returns null instead of throwing when not found.
//   Use this to assert something does NOT exist.
//
// toBeInTheDocument()       — from @testing-library/jest-dom
// toHaveAttribute(attr, val) — checks HTML attributes like href, target, rel
//
// WHY FRAMER MOTION IS MOCKED:
//   QuickLinkCard uses <motion.a>. Framer Motion v12 uses ResizeObserver which
//   jsdom doesn't implement. The mock at __mocks__/framer-motion.tsx renders
//   motion.* as plain HTML tags so tests work normally.

import { render, screen } from '@testing-library/react'
import QuickLinkCard from '@/components/QuickLinkCard'
import type { Service } from '@/components/Service'

const mockService: Service = {
  id: 'jellyfin',
  name: 'Jellyfin',
  description: 'Media server',
  url: 'http://jellyfin.server0.home',
  icon: '/icons/links/jellyfin.svg' as any,
}

const mockNoDesc: Service = {
  id: 'portainer',
  name: 'Portainer',
  url: 'http://portainer.server0.home',
  icon: '/icons/links/portainer.svg' as any,
}

const mockAdmin: Service = {
  id: 'pihole',
  name: 'Pi Hole',
  url: '10.0.0.253/admin',
  icon: '/icons/links/pihole.svg' as any,
  admin: true
}

describe('QuickLinkCard', () => {
  it('renders the service name', () => {
    render(<QuickLinkCard service={mockService} index={0} />)
    expect(screen.getByRole('heading', { name: 'Jellyfin' })).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<QuickLinkCard service={mockService} index={0} />)
    expect(screen.getByText('Media server')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<QuickLinkCard service={mockNoDesc} index={0} />)
    expect(screen.queryByText('Media server')).not.toBeInTheDocument()
  })

  it('link points to service URL', () => {
    render(<QuickLinkCard service={mockService} index={0} />)
    const link = screen.getByRole('link', { name: /jellyfin/i })
    expect(link).toHaveAttribute('href', 'http://jellyfin.server0.home')
  })

  it('link opens in new tab with noopener', () => {
    render(<QuickLinkCard service={mockService} index={0} />)
    const link = screen.getByRole('link', { name: /jellyfin/i })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders the icon image', () => {
    render(<QuickLinkCard service={mockService} index={0} />)
    expect(screen.getByRole('img', { name: 'Jellyfin' })).toBeInTheDocument()
  })
})
