var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')
var express = require('express')

var app = express();
app.use('/static', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('views', './views')
app.set('view engine', 'jade')

app.route('/')
    .get(function(req, resp){
        console.log('Enviado curso get')
        listarCursos(resp)
        
    })
    .post(function(req, resp){
        console.log('Enviado curso via post')
        var curso = { nome: req.body.nome, categoria: req.body.categoria};
        inserirCurso(curso, function(){
            listarCursos(resp)
        })

    })

app.listen(3000, function(){
    console.log('Servidor rodando na porta 3000')
})
function listarCursos(resp){
    MongoClient.connect('mongodb://172.30.30.98:27017', { useNewUrlParser: true }, function(err, database){
        const myDB = database.db('express');
        myDB.collection('cursos').find().sort({nome: 1}).toArray(function(err, result){
            console.log(333, result)
            resp.render('index', {data: result});
        })
    })
 }
function inserirCurso(obj, callback){
    MongoClient.connect('mongodb://172.30.30.98:27017', { useNewUrlParser: true }, function(err, database){
        const myDB = database.db('express');    
        myDB.collection('cursos').insertOne(obj, function(err, result){
            callback()
        })
    })
}