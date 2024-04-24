import React, {useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { setLoading,addOrder, fetchOrdersAsync } from './orderListSlice';


const initialFormState = { 
  fullName: '',
  size: '',
 toppings: []
};

export default function PizzaForm() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.orderList.loading)
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState('');

const handleChange = (e) => {
  const { name, value, type, checked} = e.target;
   if( type === 'checkbox') {
    setFormData((prevFormData) => {
      let updatedToppings;
      if(checked) {
        updatedToppings = [...prevFormData.toppings, value];
      } else {
        updatedToppings = prevFormData.toppings.filter((topping) => topping !== value);
      }
      return {...prevFormData, toppings: updatedToppings};
    });
  } else {
      setFormData((prevFormData) => ({...prevFormData, [name] : value}));

  }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError('');
  

    try{

    const toppingsIds = formData.toppings
    .filter(topping => ['Pepperoni', 'Greenpeppers', 'Pineapple', 'Mushrooms', 'Ham'].includes(topping))
    .map(topping => {
      switch (topping) {
        case 'Pepperoni':
          return 1;
          case 'Greenpeppers':
            return 2;
            case 'Pineapple':
            return 3;
            case 'Mushrooms':
              return 4;
              case 'Ham':
                return 5;
                default:
                  return null;
      } 
    });
    


    const updateFormData = {fullName: formData.fullName,
    size: formData.size,
  toppings: toppingsIds};
  
 
  

    const response = await fetch('http://localhost:9009/api/pizza/order', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updateFormData)
    });

    if(!response.ok){
      const responseData = await response.json();
      throw new Error(responseData.message || 'Failed to submit order ');
    }
    
    await new Promise(resolve => setTimeout(resolve, 250));
    dispatch(addOrder({...updateFormData, id: Date.now()}));
    dispatch(fetchOrdersAsync())
      
   dispatch(setLoading(false));
   setFormData(initialFormState);
   
  } catch (error) {
    setError(error.message || 'Failed to submit order');
    dispatch(setLoading(false))
  }
   
};



  return (
    <form onSubmit= { handleSubmit}>
      <h2>Pizza Form</h2>
      {loading && <div className='pending'>Order in progress...</div>}
      {error && <div className='failure'>{error}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value= {formData.fullName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select data-testid="sizeSelect" id="size" name="size" value= {formData.size} onChange={handleChange}>
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>
          <input data-testid="checkPepperoni" name="toppings" value= 'Pepperoni' type="checkbox" checked= {formData.toppings.includes('Pepperoni')} onChange={handleChange}/>
          Pepperoni<br /></label>
        <label>
          <input data-testid="checkGreenpeppers" name="toppings" value='Greenpeppers' type="checkbox" checked= {formData.toppings.includes('Greenpeppers')} onChange={handleChange} />
          Green Peppers<br /></label>
        <label>
          <input data-testid="checkPineapple" name="toppings" type="checkbox" value= 'Pineapple' checked= {formData.toppings.includes('Pineapple')} onChange={handleChange} />
          Pineapple<br /></label>
        <label>
          <input data-testid="checkMushrooms" name="toppings" type="checkbox" value= 'Mushrooms' checked= {formData.toppings.includes('Mushrooms')} onChange={handleChange}/>
          Mushrooms<br /></label>
        <label>
          <input data-testid="checkHam" name="toppings" type="checkbox" value= 'Ham' checked= {formData.toppings.includes('Ham')} onChange={handleChange} />
          Ham<br /></label>
      </div>
      <button data-testid="submit" type="submit" disabled= {loading}>Submit</button>
    </form>
  )
}
