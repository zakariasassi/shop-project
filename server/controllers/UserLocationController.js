const UserLocation = require("../model/UserLocatoins");


class UserLocatoin  {


    async createUserLocation(req , res) {
        try {
            const userID = req.user.id;
            const {lat , lng , place_type , place_description } = req.body
            

            console.log(req.body);
            const newUserLocation = await UserLocation.create({
                CustomerId : userID,
                Latitude : lat,
                Longitude : lng,
                placeType : place_type,
                placeDescription : place_description,
            })
            
            if(newUserLocation){
               return  res.status(201).json(newUserLocation);
            }
            return res.status(401).json({message : "مشكلة عند اضافة موقع جديد"});
        } catch (error) {
                console.log(error);
                res.status(500).json({message : "Internal Server Error"});
        }
    }


    async getAllUserLocations (req , res )  {
        try {
            const userID = req.user.id;
            const userLocations = await UserLocation.findAll({
                where : { CustomerId : userID }
            })
            if(userLocations){
                
                return res.status(200).json(userLocations);
            }
            return res.status(404).json({message : "لا يوجد مواقع متاح"});
        } catch (error) {
            console.log(error);
            res.status(500).json({message : "Internal Server Error"});
        }
    }

}



module.exports = new UserLocatoin();
