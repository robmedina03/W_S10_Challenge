import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux';
import { fetchOrdersAsync, setFilter } from './orderListSlice';

export default function OrderList() {
  const dispatch = useDispatch();
  const {loading, orders, filter} = useSelector((state) =>state.orderList);

  useEffect(() => {
    dispatch(fetchOrdersAsync())
  }, [dispatch])

  const filteredOrders = filter === 'All' ? orders : orders.filter(order => order.size === filter);
  
  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      {loading ? (
        <div> Loading...</div> ) : (
      <ol>
        {
          filteredOrders.map((order) => (
            
              <li key={order.id}>
                <div>
                  <p>
                    {order.customer} ordered a size {order.size} with{' '} {order.toppings && order.toppings.length > 0 ? order.toppings.length : 'no'} {' '} toppings</p>
                </div>
              </li>
            ))}
          
        
      </ol>
          )}
      <div id="sizeFilters">
        Filter by size:
        {
          ['All', 'S', 'M', 'L'].map(size => {
            
            return <button
              data-testid={`filterBtn${size}`}
              className={`button-filter${size === filter ? ' active' : ''}`}
              onClick={ () => dispatch(setFilter(size))}
              key={size}>{size}</button>
          })
        }
      </div>
    </div>
  )
}