
var sessionController = require('./../session/sessionController');

var cookieController = {};
cookieController.setCookie = setCookie;
cookieController.setSSIDCookie = setSSIDCookie;

/**
* setCookie - set a cookie with a random number
*
* @param req - http.IncomingRequest
* @param rs - http.ServerResponse
* @param next - Callback with signature ([err])
*/
function setCookie(req, res, next) {
	//adding test cookie
  res.cookie('codesmith','hi');

  //adding secret cookie

  res.cookie('secret', Math.floor(Math.random() * 99));
  // console.log(req.cookies);
  next();
}

/**
* setSSIDCookie - store the supplied id in a cookie
*
* @param req - http.IncomingRequest
* @param rs - http.ServerResponse
* @param id - id of the cookie to set
*/
function setSSIDCookie(req, res, id) {
  // res.cookie('ssid', id, { httpOnly: true });
  // console.log(req);
  //when we get a new user, we get a new SSID cookie with userID
  //then we create a session with the cookie/ssid id
  sessionController.startSession(id);
  
}

module.exports = cookieController;
