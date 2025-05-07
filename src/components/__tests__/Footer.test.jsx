import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders correctly', () => {
    render(<Footer />)
    // Check that the footer content is rendered
    expect(screen.getByText(/Configure your exact setup parameters/)).toBeInTheDocument()
    expect(screen.getByText(/View on GitHub/)).toBeInTheDocument()

    // Check that links are present
    const githubLink = screen.getByText('View on GitHub')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/anzax/triple-screen-planner')

    const issuesLink = screen.getByText('Open an issue')
    expect(issuesLink).toHaveAttribute(
      'href',
      'https://github.com/anzax/triple-screen-planner/issues'
    )
  })
})
