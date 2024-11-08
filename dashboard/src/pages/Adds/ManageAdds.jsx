import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { URL } from "./../../constants/URL";
import { IMAGE_URL } from "./../../constants/URL";
import Loading from "../../components/Loading/Loading";


function ManageAdds() {
  const [selectedImage, setSelectedImage] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all adds
  const { data: adds, isLoading } = useQuery("adds", async () => {
    const token = window.localStorage.getItem("token");

    const response = await axios.get(URL + "adds", {
      headers: {
        authorization: `Bearer ` + token,
      },
    });
    return response.data;
  });

  // Create a new add
  const createAddMutation = useMutation(
    async (formData) => {
      const token = window.localStorage.getItem("token");

      const response = await axios.post(URL + "adds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ` + token,
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adds");
      },
    }
  );

  // Delete an add
  const deleteAddMutation = useMutation(
    async (id) => {
      const token = window.localStorage.getItem("token");
      console.log(token);
      await axios.delete(URL + `adds?id=${id}`, {
        headers : {
          authorization: `Bearer ` + token,
        }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adds");
      },
    }
  );

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleCreateAdd = async () => {
    const formData = new FormData();
    formData.append("cover", selectedImage);
    createAddMutation.mutate(formData);
    setSelectedImage(null);
  };

  const handleDeleteAdd = (id) => {
    deleteAddMutation.mutate(id);
  };

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="p-4">
      {/* <h1 className="mb-4 text-2xl font-bold">Manage Adds</h1> */}

      <div className="mb-4">
        <input type="file" onChange={handleImageChange} />
        <button
          onClick={handleCreateAdd}
          className="px-4 py-2 ml-2 text-white bg-teal-500 rounded"
        >
         اضافة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {adds &&
          adds?.map((add) => (
            <div key={add.id} className="p-4 border rounded-lg shadow-sm">
              <img
                src={`${IMAGE_URL}adds/${add.image}`}
                alt="Add"
                className="object-cover w-full h-48 mb-4"
              />
              <button
                onClick={() => handleDeleteAdd(add.id)}
                className="px-4 py-2 text-white bg-red-500 rounded"
              >
                حدف
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ManageAdds;
