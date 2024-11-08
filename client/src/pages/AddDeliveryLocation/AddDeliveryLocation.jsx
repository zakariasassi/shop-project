import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {useMutation} from 'react-query'
 // Import the required Leaflet CSS
import "leaflet/dist/leaflet.css";

// Import marker images manually
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { URL } from "../../constant/URL";

// Create custom Leaflet default icon
const defaultIcon = L.icon({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});







function AddDeliveryLocation() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placeType, setPlaceType] = useState(null);
    const [placeDescription, setPlaceDescription] = useState(null);
    const [customePlaceType, setCustomePlaceType] = useState(null);
    const [showCustomePlace, setShowCustomePlace] = useState(false);




    const handelSelectChange = (e) => {
        if (e.target.value == "+") {
            setPlaceType(null);

            return setShowCustomePlace(true)
        }
        setShowCustomePlace(false)
        setCustomePlaceType(null);
        setPlaceType(e.target.value);

    }


    const addnewlocation = async () => {
        const response = await axios.post(URL + 'location' , {
            lat: selectedPlace.lat,
            lng: selectedPlace.lng,
            place_type: placeType === null ? customePlaceType : placeType,
            place_description: placeDescription,
        },{
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        });


    return response.data;
    
}

    const createLocationMutation= useMutation(addnewlocation , {
        mutationKey: 'addDeliveryLocation',
        onSuccess: () => {
            setShowCustomePlace(false);
            setCustomePlaceType(null);
            setPlaceType(null);
            setPlaceDescription(null);
        }
        

    })


    const submitNewLocation = async () => {
        createLocationMutation.mutate();
    }

    // Custom hook to capture click events on the map
    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setSelectedPlace({ lat, lng }); // Save clicked place's latitude and longitude
            },
        });

        // If a place is selected, show the marker
        return selectedPlace ? (
            <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={defaultIcon} />
        ) : null;
    }


    if(createLocationMutation.isLoading) return <><p>Loding</p></>
    if(createLocationMutation.isError) return <><p>Error while create location</p></>

    return (
        <>
            <p className="px-10 pt-10 text-2xl font-bold text-right text-primary ">اضف عنوان التوصيل من الخريطة</p>

            <div className="flex flex-col items-center p-8">

                {/* Display the selected place's coordinates */}
                {selectedPlace && (

                    <p className="mt-4 text-lg font-semibold text-green-500">
                        {placeType}
                        {placeDescription}
                        Latitude: {selectedPlace.lat}, Longitude: {selectedPlace.lng}
                    </p>
                )}

                <div className="flex flex-row w-full gap-2 ">
                    <select onChange={handelSelectChange} className="w-2/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option selected disabled>اختر المكان</option>

                        <option value="المنزل">المنزل</option>
                        <option value="العمل">العمل</option>
                        <option value={"+"}>اخري +</option>
                    </select>

                    {
                        showCustomePlace && (
                            <input
                                onChange={e => setCustomePlaceType(e.target.value)}
                                placeholder="ادخل اسم العنوان"
                                className="w-2/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )
                    }

                    <input
                        onChange={e => setPlaceDescription(e.target.value)}
                        placeholder="وصف المكان"
                        className="w-2/5 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button 
                                            onClick={submitNewLocation}

                    className="w-full p-2 text-white bg-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        save
                   </button>
                </div>

                {/* Map container */}

                <MapContainer
                    center={[32.89496628323387, 13.18111538887024]} // Centered around Libya
                    zoom={25}
                    scrollWheelZoom={true}
                    className="w-full mt-4 h-[560px]"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* LocationMarker component to handle map clicks */}
                    <LocationMarker />
                </MapContainer>
            </div>
        </>
    );
}

export default AddDeliveryLocation;
