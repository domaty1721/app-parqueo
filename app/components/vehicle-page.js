// components/vehicle-page.js
const { Observable } = require("@nativescript/core");
const { initDB } = require("../database");

let db = null;

exports.onNavigatingTo = function (args) {
  const page = args.object;
  page.bindingContext = new Observable();

  initDB()
    .then(database => {
      db = database;
    })
    .catch(err => {
      console.error("Error inicializando DB en vehicle-page:", err);
    });
};

exports.onRegister = function (args) {
  const page = (args.object.page || args.object);
  const plate = (page.getViewById("plate").text || "").trim();
  const type = (page.getViewById("type").text || "").trim();
  const messageLabel = page.getViewById("message");

  if (!plate || !type) {
    messageLabel.text = "⚠️ Debe llenar placa y tipo";
    return;
  }

  if (!db) {
    messageLabel.text = "⏳ Base de datos no lista, espere unos segundos";
    return;
  }

  db.execSQL("INSERT INTO vehicles (plate, type) VALUES (?, ?)", [plate, type])
    .then(id => {
      messageLabel.text = `✅ Vehículo ${plate} registrado correctamente (ID: ${id})`;
      page.getViewById("plate").text = "";
      page.getViewById("type").text = "";
    })
    .catch(err => {
      console.error("Error insert vehicles:", err);
      messageLabel.text = "❌ Error al registrar vehículo";
    });
};
