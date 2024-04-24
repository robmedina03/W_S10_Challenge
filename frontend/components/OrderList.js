import React, { useEffect} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { setLoading, setOrders, setFilter } from '../components/orderListSlice'


export default function OrderList() {
  const dispatch = useDispatch();
  const { loading, orders, filter} = useSelector((state) => state.orderList)

  useEffect(() => {
    fetchOrders();
  }, [filter])

  const fetchOrders = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch (`http://localhost:9009/api/pizza/history`);
      if(!response.ok) {
        throw new Error('Failed to fetch orders');
        
      }
      const data = await response.json();
      const filteredOrders = filter === 'All' ? data : data.filter((order) => order.size === filter);
      dispatch(setOrders(filteredOrders))
      
    }catch(error){
      console.error('Error fetching orders:', error);
      dispatch(setOrders([]));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = (size) => {
   // const filterValue = size === 'All' ? 'All' : size.toUpperCase()
    dispatch(setFilter(size));

  };

  

  

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {loading && <div> Loading...</div>}
      <ol>
        {
          orders.map(order => (
            
              <li key={order.id}>
                <div>
                  <p>{order.customer} ordered a size {order.size} with{' '} {order.toppings && order.toppings.length > 0 ? order.toppings.length : 'no'} toppings</p>
                  
                </div>
              </li>
            ))}
          
      </ol>
    
      <div id="sizeFilters">
        Filter by size:
        {
          ['All', 'S', 'M', 'L'].map((size) => (
            <button
            key={size}
            onClick={() => handleFilterChange(size)}
            data-testid={`filterBtn${size}`}
             className = {`button-filter${size === filter ? ' active' : ''}`} >{size}
          </button>
          ))}
            
          
      </div>
      
     
      
    </div>
  );
}
