import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from './hero';

describe('Hero', () => {
    it('renders a heading', () => {
        render(<Hero />)

        const heading = screen.getByRole('heading', { level: 1, name: 'kleur' })

        expect(heading).toBeInTheDocument()
    })
})