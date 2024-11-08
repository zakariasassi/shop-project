import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import { URL } from '../../../constants/URL';
import toast, { Toaster } from 'react-hot-toast';

const CreateCards = () => {
  const [numberOfCards, setNumberOfCards] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const createCards = async () => {
    const token = localStorage.getItem('token'); // Assuming the token is stored with the key 'token'
    
    const { data } = await axios.post(URL + 'cards/', {
        numberOfCards: numberOfCards,
        initialBalance: initialBalance,
      },
      {
        headers: {
          authorization: `Bearer ` + token,
        },
      }
    );
    console.log(data);
    return data;
  };

  const mutation = useMutation(createCards, {
    onSuccess: (data) => {
      setNumberOfCards('');
      setInitialBalance('');
    },
    onError: () => {},
    onSettled: () => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ numberOfCards, initialBalance });
  };

  return (
    <div className="max-w-md p-8 mx-auto mt-10 bg-white rounded-lg ">
      <Toaster/>
      {mutation.isError && <p className="mb-4 text-red-500">{mutation.error.message}</p>}
      {mutation.isSuccess && (
        <div className="mb-4 text-black">
          <p>تم توليد الكروت بنجاح</p>
    
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="numberOfCards" className="block text-sm font-medium text-gray-700">عدد الكروت</label>
          <input
            type="number"
            id="numberOfCards"
            value={numberOfCards}
            onChange={(e) => setNumberOfCards(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-sm text-black border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700">قيمة الكروت </label>
          <input
            type="number"
            id="initialBalance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-sm text-black border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${mutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'جاري انشاء الكروت...' : ' توليد الكروت'}
        </button>
      </form>
    </div>
  );
};

export default CreateCards;