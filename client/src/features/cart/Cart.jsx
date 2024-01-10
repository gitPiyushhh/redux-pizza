import { useDispatch, useSelector } from 'react-redux';


import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import CartItem from '../cart/CartItem';
import EmptyCart from '../cart/EmptyCart';
import { clearCart, getCart } from './cartSlice';
import { getUser } from '../user/userSlice';

function Cart() {
  const dispatch = useDispatch()

  const cart = useSelector(getCart);
  const userName = useSelector(getUser);


  if(!cart.length) {
    return <EmptyCart />
  }


  return (
    <div className='px-4 py-3'>
      <LinkButton to={'/menu'}>&larr; Back to menu</LinkButton>

      <h2 className='mt-7 text-large font-semibold'>Your cart, {userName} </h2>

      <ul className='divide-y divide-stone-200 border-b mt-3'>
        {cart.map(item => <CartItem item={item} key={item.pizzaId}/>)}
      </ul>

      <div className='mt-6 space-x-2'>
        <Button to="/order/new" type='primary'>Order pizzas</Button>
        <Button type='secondary' onClick={() => dispatch(clearCart())}>Clear cart</Button>

      </div>
    </div>
  );
}

export default Cart;
