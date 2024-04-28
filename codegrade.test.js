import React from 'react'
import { render, waitFor, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux'
import server from './backend/pizza-router-mock'
import { reset } from './backend/helpers'
import { resetStore } from './frontend/state/store'
import App from './frontend/components/App'

jest.setTimeout(1500)
const waitForOptions = { timeout: 300 }
const queryOptions = { exact: false }

beforeAll(() => { server.listen() })
afterAll(() => { server.close() })
beforeEach(() => {
  render(<Provider store={resetStore()}><App /></Provider>)
})
afterEach(() => {
  reset()
  server.resetHandlers()
})

describe('Pizza App', () => {
  let fullName, size, pepperoni, greenpeppers, pineapple, mushrooms, ham, submit, btn_all, btn_s, btn_m, btn_l, user
  beforeEach(async () => {
    user = userEvent.setup()
    fullName = screen.getByTestId('fullNameInput')
    size = screen.getByTestId('sizeSelect')
    pepperoni = screen.getByTestId('checkPepperoni')
    greenpeppers = screen.getByTestId('checkGreenpeppers')
    pineapple = screen.getByTestId('checkPineapple')
    mushrooms = screen.getByTestId('checkMushrooms')
    ham = screen.getByTestId('checkHam')
    submit = screen.getByTestId('submit')
    btn_all = screen.getByTestId('filterBtnAll')
    btn_s = screen.getByTestId('filterBtnS')
    btn_m = screen.getByTestId('filterBtnM')
    btn_l = screen.getByTestId('filterBtnL')

    await waitFor(() => screen.getByText('Sigourney Weaver ordered', queryOptions), waitForOptions)
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(1)
  })
  test('[1] Existing "Sigourney Weaver" order from the server renders correctly', async () => {
    // this checks only the assertions inside the beforeEach above
  })
  test('[2] Correct history item renders on order with no toppings', async () => {
    await user.type(fullName, 'Meryl Streep')
    await user.selectOptions(size, 'Large')
    await user.click(submit)
    await waitFor(() => screen.getByText('Meryl Streep ordered a size L with no toppings', queryOptions), waitForOptions)
  })
  test('[3] Correct history item renders on order with some toppings', async () => {
    await user.type(fullName, 'James Dean')
    await user.selectOptions(size, 'Medium')
    await user.click(pepperoni) // check
    await user.click(pepperoni) // uncheck
    await user.click(ham)
    await user.click(pineapple)
    await user.click(greenpeppers)
    await user.click(mushrooms)
    await user.click(submit)
    await waitFor(() => screen.getByText('James Dean ordered a size M with 4 toppings', queryOptions), waitForOptions)
  })
  test('[4] Validation message ("fullName is required") renders if order lacks fullName', async () => {
    await user.selectOptions(size, 'Large')
    await user.click(submit)
    await waitFor(() => screen.getByText('fullName is required', queryOptions), waitForOptions)
  })
  test('[5] Validation message ("size must be etc") renders if order lacks size', async () => {
    await user.type(fullName, 'Meryl Streep')
    await user.click(submit)
    await waitFor(() => screen.getByText('size must be one of the following values', queryOptions), waitForOptions)
  })
  test('[6] Size filter buttons ("All", "S", "M", "L") work correctly', async () => {
    // Medium
    // 1
    await user.type(fullName, 'Jodie Foster')
    await user.selectOptions(size, 'Medium')
    await user.click(submit)
    await waitFor(() => screen.getByText('Jodie Foster ordered', queryOptions), waitForOptions)
    // 2
    await user.type(fullName, 'Jared Hill')
    await user.selectOptions(size, 'Medium')
    await user.click(submit)
    await waitFor(() => screen.getByText('Jared Hill ordered', queryOptions), waitForOptions)
    // Large
    // 1
    await user.type(fullName, 'Chadwick Boseman')
    await user.selectOptions(size, 'Large')
    await user.click(submit)
    await waitFor(() => screen.getByText('Chadwick Boseman ordered', queryOptions), waitForOptions)
    // 2
    await user.type(fullName, 'Kathy Bates')
    await user.selectOptions(size, 'Large')
    await user.click(submit)
    await waitFor(() => screen.getByText('Kathy Bates ordered', queryOptions), waitForOptions)
    // 3
    await user.type(fullName, 'David Gyasi')
    await user.selectOptions(size, 'Large')
    await user.click(submit)
    await waitFor(() => screen.getByText('David Gyasi ordered', queryOptions), waitForOptions)
    // Default
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(6)
    // Small
    await user.click(btn_s)
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(1)
    expect(screen.getAllByText('ordered a size S', queryOptions)).toHaveLength(1)
    // Medium
    await user.click(btn_m)
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(2)
    expect(screen.getAllByText('ordered a size M', queryOptions)).toHaveLength(2)
    // Large
    await user.click(btn_l)
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(3)
    expect(screen.getAllByText('ordered a size L', queryOptions)).toHaveLength(3)
    // All
    await user.click(btn_all)
    expect(screen.getAllByText('ordered a size', queryOptions)).toHaveLength(6)
  }, 6000)
  test('[7] Message "Order in progress" renders during order creation', async () => {
    await user.type(fullName, 'Penelope Cruz')
    await user.selectOptions(size, 'Medium')
    await user.click(mushrooms)
    await user.click(submit)
    await waitFor(() => screen.getByText('Order in progress', queryOptions), waitForOptions)
    await waitForElementToBeRemoved(() => screen.queryByText('Order in progress', queryOptions))
  })
})
