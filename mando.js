var Servient = require("@node-wot/core").Servient;
var MqttsClientFactory = require("@node-wot/binding-mqtt").MqttsClientFactory;
const express = require('express');
const app = express();

Helpers = require("@node-wot/core").Helpers;

//Creamos el Servient y el protocolo MQTT

let servient = new Servient();
servient.addClientFactory(new MqttsClientFactory({rejectUnauthorized: false}));

//Thing description

let td = `{
    "@context": "https://www.w3.org/2019/wot/td/v1",
    "title": "AireAcondicionado",
    "id": "urn:dev:wot:mqtt:AireAcondicionado",
    "properties": {
        "temperatura": {
            "type": "integer",
            "forms": [{
                "href": "mqtts://localhost:8443/AireAcondicionado/properties/temperatura"
            }]
        }
    },
    "actions" : {
        "OnOff": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/OnOff"}
            ]
        },
        "incrementar": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/incrementar"}
            ]
        },
        "decrementar": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/decrementar"}
            ]
        },
        "leerTemperatura": {
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/actions/leerTemperatura"}
            ]
        }
    }, 
    "events": {
        "estadoTemperatura": {
            "type": "integer",
            "forms": [
                {"href": "mqtts://localhost:8443/AireAcondicionado/events/estadoTemperatura"}
            ]
        } 
    } 
}`;

try {
    servient.start().then((WoT) => {
        WoT.consume(JSON.parse(td)).then((thing) => {
            console.info(td);

            

            thing.subscribeEvent(
                "estadoTemperatura",
                (temperatura) => console.info("value:", temperatura),
                (e) => console.error("Error: %s", e),
                () => console.info("Completado")
            )

            console.info("Suscrito");

            app.set('view engine', 'jade');

            app.get("/mando", function (req, res) {
                res.render("mando", {
                    title: "Mando del aire"
                });
            });

            app.get("/subirTemperatura", function (req, res) {
                res.render("mando", {
                    title: "Mando del aire",
                    subirTemperatura: thing.invokeAction('incrementar')
                });
            });

            app.get("/bajarTemperatura", function (req, res) {
                res.render("mando", {
                    title: "Mando del aire",
                    bajarTemperatura: thing.invokeAction('decrementar')
                });
            });

            app.get("/mostrarTemperatura", function (req, res) {
                res.render("mando");
            });

            app.listen(4000);
        });
    });
} catch (err) {
    console.error("Error en el script: ", err);
}