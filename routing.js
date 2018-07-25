var request = require('request');

//Conteudo do Request
var requestURL = 'http://solver.vroom-project.org';
var headers = {
  'Content-Type': 'application/json'
};
var jsonData = {
   "vehicles":[
      {
         "id":0,
         "start":[-48.8517561, -26.2948961],
         "end":[-48.8517561, -26.2948961]
      }
   ],
   "jobs":[
      {
         "id":0,
         "location":[-48.88164, -26.27245]
      },
      {
         "id":1,
         "location":[-48.87346, -26.28319]
      },
   ],
   "options":{
      "g":true
   }
};

//Options do Request
var options = {
  url: requestURL,
  method: "POST",
  headers: headers,
  body: JSON.stringify(jsonData)
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info);
  } else {
    console.log(error);
  }
}

request(options, callback);
