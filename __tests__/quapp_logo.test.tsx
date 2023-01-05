import { render } from '@testing-library/react'
import { LogoSVG } from '../components/svg/quapp_logo'

it('renders Quapp Logo unchanged', () => {
  const { container } = render(<LogoSVG title={'Quapp Logo'} />)
  expect(container).toMatchSnapshot()
})
