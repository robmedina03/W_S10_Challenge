import React, {useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { postOrder } from './pizzaApi'
import { setLoading,fetchOrdersAsync, addOrder} from './orderListSlice';


const initialFormState = { 
  fullName: '',
  size: '',
  toppings: [],
 
}

export default function PizzaForm() {

  const dispatch = useDispatch();
  const  loading = useSelector((state) => state.orderList.loading);
  const [formData, setFormData] = useState(initialFormState)
  const [ error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked} = e.target;
   if( type === 'checkbox') {
    setFormData((prevFormData) => {
      let updatedToppings;
      if(checked) {
       
        updatedToppings = [...prevFormData.toppings, name];
      
    } else {

      updatedToppings= prevFormData.toppings.filter((topping) => topping !== name);
    }
      return {...prevFormData, toppings: updatedToppings};
    });
  } else {
      setFormData((prevFormData) => ({...prevFormData, [name] : value}));

  }
};


  const handleSubmit = async (event) => {
   event.preventDefault();
      const { fullName, size,toppings} = formData;


      if(!fullName.trim()) {
        setError('fullName is required');
        return 
      }
      
      
      if (fullName.length <3 ){
        setError('fullName must be at least 3 characters')
        return 
      }
      if (fullName.length > 20  ){
        setError('fullName cannot exceed 20 characters')
        return 
      }
      if (!['S','M', 'L'].includes(size)){
        setError('size must be one of the following values: S, M, L')
        return 
      }
     




   
    try  {
      dispatch(setLoading(true))
      setError('')
  

      const toppingsIds = toppings
      .filter((topping) => ['Pepperoni', 'Greenpeppers', 'Pineapple', 'Mushrooms', 'Ham'].includes(topping))
    .map((topping) => {
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

      const response = await dispatch(postOrder(updateFormData))
      if(response.error){
        throw new Error(response.error.message || 'Failed to submit order')
      }
      await new Promise((resolve) => setTimeout(resolve, 200))
      dispatch(addOrder({...formData, id: Date.now()}))
     dispatch(fetchOrdersAsync())
  
   
    setFormData(initialFormState)

  } catch (error) {
    setError(error.message || 'Failed to submit order');
    
  }finally{
  dispatch(setLoading(false))
  }

};



  
  
    

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      {loading && <div className='pending'>Order in progress...</div>}
      {error && <div className='failure'>Order failed:{error}</div>}

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
          <select data-testid="sizeSelect" id="size" name="size" value={formData.size} onChange={handleChange}>
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label>
          <input data-testid="checkPepperoni" name="Pepperoni" type="checkbox" checked= {formData.toppings.includes('Pepperoni')}  onChange={handleChange}/>
          Pepperoni<br /></label>
        <label>
          <input data-testid="checkGreenpeppers" name="Greenpeppers" type="checkbox" checked= {formData.toppings.includes('Greenpeppers')}  onChange={handleChange} />
          Green Peppers<br /></label>
        <label>
          <input data-testid="checkPineapple" name="Pineapple" type="checkbox" checked= {formData.toppings.includes('Pineapple')}  onChange={handleChange} />
          Pineapple<br /></label>
        <label>
          <input data-testid="checkMushrooms" name="Mushrooms" type="checkbox" checked= {formData.toppings.includes('Mushrooms')}  onChange={handleChange} />
          Mushrooms<br /></label>
        <label>
          <input data-testid="checkHam" name="Ham" type="checkbox" checked= {formData.toppings.includes('Ham')}  onChange={handleChange} />
          Ham<br /></label>
      </div>
      <input data-testid="submit" type="submit" />
    </form>
  )
}