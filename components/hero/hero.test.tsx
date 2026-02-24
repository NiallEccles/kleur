import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from './hero'

jest.mock('@/components/Grainient', () => () => null)

describe('Hero', () => {
    it('renders the main heading', () => {
        render(<Hero />)
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders a link to explore tools', () => {
        render(<Hero />)
        expect(screen.getByRole('link', { name: 'Explore Tools' })).toBeInTheDocument()
    })
})
