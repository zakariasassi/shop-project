import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getProfile,
  updateProfile,
  getWalletBalance,
  chargeWallet,
} from "../../api/Customer";
import axios from "axios";
import { IMAGE_URL, URL } from "../../constant/URL";


import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from './../../components/Loading/Loading';
import AuthContext from "../../context/AuthContext";


function Profile() {

  const { isLoggedIn } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const [walletAmount, setWalletAmount] = useState("");
  const [profileData, setProfileData] = useState({
    // username: "",
    // phone: "",
    fullName: "",
    email: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery(
    "profile",
    () => getProfile("customer/profile"),
    {
      onSuccess: (data) => {
        setProfileData(data);
        setPreviewImage(data.image);
      },
    }
  );

  const { data: walletBalance, isLoading: walletLoading } = useQuery(
    "walletBalance",
    () => getWalletBalance("wallet/balance"),
    {
      enabled: !!isLoggedIn, // Only run the query when login is true
    }
  );


  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("profile");
    },
  });

  const chargeWalletMutation = useMutation(chargeWallet, {
    onSuccess: () => {
      queryClient.invalidateQueries("walletBalance");
    },
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    let token = window.localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("username", profileData.username);
    formData.append("phone", profileData.phone);
    formData.append("fullName", profileData.fullName);
    formData.append("email", profileData.email);

    const response = await axios.put(`${URL}customer/profile`, formData, {
      headers: {
        authorization: `Bearer ` + token,
      },
    });

    const imageUrl = response.data.url;
    updateProfileMutation.mutate({
      data: { ...profileData, image: imageUrl },
      point: "customer/profile",
    });
  };

  const handleChargeWallet = () => {
    chargeWalletMutation.mutate({
      data: { walletAmount: walletAmount },
      point: "wallet/charge",
    });
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setImageFile(file);
    const objectUrl = window.URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    return () => window.URL.revokeObjectURL(objectUrl);
  };

  if (profileLoading || walletLoading) return <><Loading /></>;

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">حسابي</h1>
      <div className="flex flex-col p-6 mb-6 rounded-lg gap-7 md:flex-row">
        <div className="flex justify-center gap-6 mb-6 p-7 md:w-1/3 md:mb-0">
          <div className="">

            {
              profileData.image ? (
                <>
                  <img
                    src={IMAGE_URL + 'custmoerprofile/' + `${profileData?.image}`}

                    className="object-center w-auto h-[250px] "
                  />
                </>
              ) : (

                <Skeleton />
              )
            }

            <div className="flex flex-col items-center gap-5 mt-6 justify-normal">


              <input
                id="file-upload"
                type="file"
                className=""
                onChange={handleImageChange}
              />
            </div>

          </div>
        </div>
        <div className="md:w-2/3 md:ml-6">
          {/* <div className="mb-4">
            <label className="block text-gray-700">اسم المستخدم</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div> */}
          {/* <div className="mb-4">
            <label className="block text-gray-700">رقم الهاتف</label>
            <input
              type="text"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) =>
                setProfileData({ ...profileData, fullName: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">البريد الإلكتروني</label>
            <input
              type="text"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={e => handleProfileUpdate(e)}
            className="p-2 text-white bg-teal-400 rounded"
          >
            {
              updateProfileMutation.isLoading ? <>
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </> : <> تحديث  </>
            }
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold">المحفظة</h2>
        <p className="text-lg">القيمة: ${walletBalance?.balance.toFixed(2)}</p>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="رقم قسيمة التعبئة"
          />
          <button
            onClick={handleChargeWallet}
            className="p-2 ml-2 text-white bg-teal-400 rounded"
          >
            {
              chargeWalletMutation.isLoading ? <>
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </> : <> شحن </>
            }

          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
