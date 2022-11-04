var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')

mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"CS157A_project"
})

var app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.listen(8080);
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"secret"}))

app.get('/', function(req, res){
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"CS157A_project"
    })
    con.query("SELECT * FROM products", (err, result) => {
        res.render('pages/index.ejs', {result:result})
    });
})

app.post('/add_to_cart', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var category = req.body.category;
    var image = req.body.image;
    var product = {id:id, name:name, category:category, image:image}

     
})

console.log("server running on port 8080");