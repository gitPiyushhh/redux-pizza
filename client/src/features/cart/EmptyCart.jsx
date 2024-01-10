import { Link } from 'react-router-dom';

function EmptyCart() {
  return (
    <div className='px-4 py-6'>
      <Link to="/menu" className='text-blue-400'>&larr; Back to menu</Link>

      <p className='py-3'>Your cart is still empty. Start adding some pizzas :)</p>
    </div>
  );
}

export default EmptyCart;
