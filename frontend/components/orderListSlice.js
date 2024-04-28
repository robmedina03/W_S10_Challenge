import {createSlice} from '@reduxjs/toolkit';

export const orderListSlice = createSlice({
    name : 'orderList',
    initialState: {
    loading: true,
    orders: [],
    filter: 'All',
    error:null
    },

    reducers: {
        setLoading: (state, action) =>{
            state.loading = action.payload;
        },
        setOrders: (state, action) =>{
            state.orders = action.payload;
        },
        setFilter: (state, action) =>{
            state.filter = action.payload;
        },

        addOrder:(state, action) => {
            state.orders.push(action.payload);
        },
        setError: (state, action) => {
            state.error = action.payload
        },

    }

});

export const { setLoading, setOrders, setFilter, addOrder, setError} = orderListSlice.actions;

export const fetchOrdersAsync = () => async (dispatch) =>{
    dispatch(setLoading(true));

    try {
          const response = await fetch('http://localhost:9009/api/pizza/history');
          if(!response.ok) {
            throw new Error('Failed to fetch orders')
          }
          const orders = await response.json();
          dispatch(setOrders(orders));
        }catch (error) {
          console.error('Error fetching orders', error);
          dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
                   
       };


export default orderListSlice.reducer;
