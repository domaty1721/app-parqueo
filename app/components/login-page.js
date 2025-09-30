// components/login-page.js
const Frame = require("@nativescript/core").Frame;
const { initDB } = require("../database");

let db = null;

exports.onNavigatingTo = function (args) {
  const page = args.object;
  page.bindingContext = {}; // simple binding context

  // inicializa DB (si no está inicializada)
  initDB()
    .then(database => {
      db = database;
    })
    .catch(err => {
      console.error("Error inicializando DB:", err);
    });
};

exports.onLogin = function (args) {
  const page = (args.object.page || args.object);
  const username = (page.getViewById("username").text || "").trim();
  const password = (page.getViewById("password").text || "").trim();
  const messageLabel = page.getViewById("message");

  if (!username || !password) {
    messageLabel.text = "⚠️ Ingrese usuario y contraseña";
    return;
  }

  if (!db) {
    messageLabel.text = "⏳ Base de datos todavía no lista, espere un momento y vuelva a intentar";
    return;
  }

  db.get("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, row) => {
    if (err) {
      console.error("Error DB en login:", err);
      messageLabel.text = "❌ Error en base de datos";
      return;
    }

    if (row) {
      // row is an array: [id, username, password]
      const foundUsername = row[1];
      if (foundUsername === "admin") {
        // navegar a vehicle-page
        Frame.topmost().navigate("components/vehicle-page");
      } else {
        messageLabel.text = `✅ Bienvenido ${foundUsername}. No tiene permisos de admin.`;
      }
    } else {
      messageLabel.text = "❌ Usuario o contraseña incorrectos";
    }
  });
};
