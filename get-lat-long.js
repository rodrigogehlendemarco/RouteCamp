var request = require('request');

var key = 'nrXeeq9i2Hv2pcSIkAEyuEUrvmlT7PIa';

var rua = 'Rua Max Colin';
var numero = 941;
var cidade = 'Joinville';
var pais = 'Brasil';
var endereco = String(rua.replace(/ /g, '+') + ',' + String(numero) + ',' + cidade + ',' + pais);

console.log('\n================\n');
console.log('Endereço:')
console.log('\n================\n');
console.log(endereco);
console.log('\n================\n');

request('http://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + endereco, function(err, res, body) {
  console.log('\n================\n');
  console.log('raw response:');
  console.log('\n================\n');
  console.log(body);
  console.log('\n================\n');
  console.log('Latitude e longitude:')
  console.log('\n================\n');
  //printa latitude
  console.log(JSON.parse(body).results[0].locations[0].latLng.lat)
  //printa longitude
  console.log(JSON.parse(body).results[0].locations[0].latLng.lng)
  console.log('\n================\n');
});
