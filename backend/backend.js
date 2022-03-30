const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

// mengkonfigurasi database dan membuat koneksi
const db = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "rest_api",
});

// error handling
db.connect((err) => {
  if (err) console.log(err.message);
  else console.log("koneksi berhasil");
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mengambil data pegawai
app.get("/pegawai", (req, res) => {
  let sql = "SELECT * FROM pegawai";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let response = {
        count: result.length,
        pegawai: result,
      };

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(response));
    }
  });
});

app.post("/pegawai", (req, res) => {
  let find = req.body.find;
  let sql =
    "SELECT * FROM pegawai WHERE nip LIKE '%" +
    find +
    "%' OR nama LIKE '%" +
    find +
    "%' OR alamat LIKE '%" +
    find +
    "%'";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let response = {
        count: result.length,
        pegawai: result,
      };
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(response));
    }
  });
});

app.post("/pegawai/save", (req, res) => {
  let data = {
    nip: req.body.nip,
    nama: req.body.nama,
    alamat: req.body.alamat,
  };
  let message = "";

  let sql = "insert into pegawai set ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row inserted";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

app.post("/pegawai/update", (req, res) => {
  let data = [
    {
      nip: req.body.nip,
      nama: req.body.nama,
      alamat: req.body.alamat,
    },
    req.body.nip,
  ];
  let message = "";

  let sql = "UPDATE pegawai SET ? WHERE nip = ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row updated";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

app.delete("/pegawai/:nip", (req, res) => {
  let data = {
    nip: req.params.nip,
  };
  let message = "";
  let sql = "delete from pegawai where ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row deleted";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

app.listen(2910, () => {
  console.log("Server run on port 2910");
});
