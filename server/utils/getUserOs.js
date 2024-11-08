const UAParser = require('ua-parser-js');


 const getUserOS = (req) => {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser();
    parser.setUA(userAgent);
    return parser;
  };
  

  module.exports = getUserOS;