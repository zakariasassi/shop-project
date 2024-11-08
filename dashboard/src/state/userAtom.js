import { atom } from 'jotai'



let user = JSON.parse(window.localStorage.getItem('user'))
export const profile = atom(user)
