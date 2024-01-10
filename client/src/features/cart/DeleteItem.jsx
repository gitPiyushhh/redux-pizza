import React from 'react'
import Button from '../../ui/Button'
import { useDispatch } from 'react-redux'
import { deleteItem } from './cartSlice'

function DeleteItem({pizzaId}) {
    const dispatch = useDispatch()

  return (
    <div>
        <Button type='small' onClick={() => dispatch(deleteItem(pizzaId   ) )}>Delete</Button>
    </div>
  )
}

export default DeleteItem