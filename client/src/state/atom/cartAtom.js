import {atom} from 'jotai';

let cartArray = JSON.parse(window.localStorage.getItem('cart'))






export const countCart = atom(cartArray?.length ? cartArray.length : 0)
