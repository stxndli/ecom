import { atom } from 'recoil'
import { ICartItem } from '../typings'

export const modalState = atom({
  key: 'modalState',
  default: false,
})
export const cartState = atom({
  key: 'cartState',
  default: {},
})