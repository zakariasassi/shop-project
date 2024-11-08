import axios from 'axios';
import { URL } from '../constant/URL';






export const newVist = async () => {
    try {
        await axios.post( URL +  'visiters/newVisiter');
    } catch (error) {
        console.error('Error recording visit', error);
    }
}