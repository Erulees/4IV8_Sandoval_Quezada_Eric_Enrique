const express = require('express'), mysql = require('mysql2');
const app = express(), PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'n0m3l0',
    database:'pnt_practica1'
}).promise();

app.get('/api/alumnos', async(req,res)=>
    res.json((await db.query('SELECT * FROM alumnos'))[0])
);

app.listen(PORT, ()=>console.log('Servidor iniciado'));