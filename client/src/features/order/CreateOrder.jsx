import { useState } from 'react';
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';

import store from '../../store';
import { formatCurrency } from '../../utils/helpers';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {
    userName,
    status: addressStatus,
    position,
    address,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === 'loading'; 

  const cart = useSelector(getCart);
  const formErrors = useActionData();
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? 0.2 * totalCartPrice : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new">  --> By default, React router always takes the nearest route*/}

      <Form method="POST">
        <div className="mb-5 flex flex-col items-center gap-2 sm:flex-row">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            className="input grow"
            defaultValue={userName}
            required
          />
        </div>

        <div className="mb-5 flex flex-col items-center gap-2 sm:flex-row">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" className="input w-full" required />
            {formErrors?.phone && (
              <p className="rounded-mdd mt-2 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col items-center gap-2 sm:flex-row">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              className="input w-full"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
          </div>
          <span className=" absolute right-1 z-10">
            <Button
              type="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(fetchAddress())
              }}
              disabled={isLoadingAddress}  
            >
              {isLoadingAddress ? 'Fetching...' : 'Get position'}
            </Button>
          </span>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
            className="focus:ring-offset h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400"
          />
          <label htmlFor="priority" className="cursor-pointer font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting} type="primary">
            {isSubmitting
              ? 'Placing Order'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// Whenever the <Form> is submitted, the action function is called ..
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true  ',
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      'Please give correct phone num, we might need to contact you';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  // If OK, create order and redirect
  const newOrder = await createOrder(order);

  // Don't overuse (We have to use here coz useDispactch is not availablr in normal function call.. )
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
