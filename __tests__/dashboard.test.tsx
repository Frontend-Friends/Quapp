import { render } from '@testing-library/react'
import { Dashboard } from '../components/pages/dashboard'

it('renders Dashboard unchanged', () => {
  const { container } = render(<Dashboard t={(key) => key} />)
  expect(container).toMatchSnapshot()
})
