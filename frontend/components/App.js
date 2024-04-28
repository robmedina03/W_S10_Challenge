import React from 'react'
import PizzaForm from './PizzaForm'
import OrderList from './OrderList'
import {Provider} from 'react-redux'
import { store } from '../state/store'

export default function App() {
  return (
    <Provider store={store}>
    <div id="app">
      <PizzaForm />
      <OrderList />
    </div>
    </Provider>
  )
}
