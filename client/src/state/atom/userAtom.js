import axios from 'axios';
import {atom} from 'jotai';
import { URL } from '../../constant/URL';



const token = localStorage.getItem('token'); // Retrieve token from localStorage
const isLogin = localStorage.getItem('isLogin'); // Retrieve token from localStorage
let cartArray ;

if(isLogin){
     cartArray = await axios.get(URL + "customer/profile" , {
        headers : {
            authorization: `Bearer ` + token,
        }
    })
}





export const userData = atom(cartArray ? cartArray.data : [] )
