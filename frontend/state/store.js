import { configureStore } from '@reduxjs/toolkit'
import orderListReducer from '../components/orderListSlice'
import { postOrder } from '../components/pizzaApi'




const exampleReducer = (state = { count: 0 }) => {
  return state
}

export const resetStore = () => configureStore({
  reducer: {
    example: exampleReducer,
    orderList: orderListReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat()
    
    // if using RTK Query for your networking: add your middleware here
    // if using Redux Thunk for your networking: you can ignore this

})

export const store = resetStore()
