import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from '../../pages/index'

describe('Home', () => {
  it('should render "NextJS boilerplate 🚀" on screen', async () => {
    render(<Home />)
    expect(await screen.getByText('NextJS Boilerplate 🚀')).toBeTruthy()
  })
})
