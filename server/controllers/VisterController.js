const WebsiteVisit = require('../model/WebsiteVisit.js');
const getUserOS  = require('../utils/getUserOs.js');

 const newVisit = async (req, res) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const ipAddress = req.ip; // Get the visitor's IP address
  


      const parser = getUserOS(req);

      // Check if the IP address has already visited today
      const existingVisit = await WebsiteVisit.findOne({
        where: {
          visitDate: currentDate,
          ipAddress: ipAddress,
        },
      });
  
      if (existingVisit) {
        res.status(200).send('Visit already recorded today');
      } else {
        // Create a new record for this visit
        await WebsiteVisit.create({
          visitDate: currentDate,
          ipAddress: ipAddress,
          browser : parser.getBrowser().name,
          os : parser.getOS().name,
          device : parser.getDevice().vendor,
          visitCount: 1,
        });
  
        res.status(200).send('Visit recorded');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error recording visit');
    }
  };


  module.exports = newVisit;