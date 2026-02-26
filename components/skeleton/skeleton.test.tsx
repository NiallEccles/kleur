import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Skeleton from './skeleton';

describe('Skeleton', () => {
    it('renders a skeleton', () => {
        render(<Skeleton route={'/'} />)

        const skeleton = screen.getByRole('link', { name: /create your own/i })

        expect(skeleton).toBeInTheDocument()
    })
})