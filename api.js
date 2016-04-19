var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var Client = require('node-rest-client').Client;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

module.exports = function(wagner) {
  var api = express.Router();
  var client = new Client();
  var serialPort = new SerialPort("/dev/ttyACM0",
    {
      baudrate: 9600,
      parser: serialport.parsers.readline("\n")
    });

  api.use(bodyparser.json());

  api.get('/current', function(req, res) {
      // serialPort.open(function (err) {
      //   if (err) {
      //     return console.log('Error opening port: ', err.message);
      //   }

        // errors will be emitted on the port since there is no callback to write
        serialPort.write(1);
      // });
    client.get("http://api.openweathermap.org/data/2.5/weather?q=Parana,ar&appid=a3c7f0ae8a5cf4854f92b9d9ea275271",
      function (data, response) {
        if(data["cod"] != "404"){
          var resp = data.weather.main;
          //if(resp === "Clouds"){
            resp = 1;
            // serialPort.on('open', function () {
            //   console.log(1);
            //   serialPort.write(1, function(err, bytesWritten) {
            //     console.log(bytesWritten);
            //     if (err) {
            //       console.log('Error: ', err.message);
            //     }
            //     console.log(bytesWritten, 'bytes written');
            //   });
            // });
            console.log('returning json');
            return res.json({data: data});
          //}
        }
        else{
          console.log('error!!!');
          return res.json({error: {code: data.cod, message: data.message}})
        }
      });
  });

  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
