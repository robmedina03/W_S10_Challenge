import {createAsyncThunk} from '@reduxjs/toolkit'

export const postOrder = createAsyncThunk(
    'pizza/order',
    async (orderData, {rejectWithValue}) => {
        try {
          

           const response = await fetch('http://localhost:9009/api/pizza/order', {

           method:'POST',
           headers: {
            'content-type': 'application/json',
           },
           body: JSON.stringify(orderData),
           });
           if(!response.ok){
            let errorMessage = 'Failed to submit order';
            try{
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
           
           
        } catch(error){
            console.error('Error posting order', error);
        }
        throw new Error(errorMessage);
           
        }
        return await response.json();
    }catch(error){
        console.error('Error posting order', error);
        return rejectWithValue({message: error.message});
    }
    }
);

