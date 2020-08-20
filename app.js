var express = require('express')
var app = express();
var fs = require('fs');

var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

const engines = require('consolidate');
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

//localhost:5000
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/register', function (req, res) {
    res.render('register');
})
app.get('/productmanagement', function (res, res) {
    res.render('productmanagement');
})
app.get('/accountmanagement', function (res, res) {
    res.render('accountmanagement');
})
app.get('/insert',function (res, res){
    res.render('insert')
})



var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hunguv:hung1371999@cluster0.0sx3o.mongodb.net/test";


app.post('/doRegister', async (req, res) => {
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    let dbo = client.db("AccountDB");
    let data = {
        name: inputName,
        email: inputEmail,
    }
    //check data before writing to file
    if (inputName.length < 4) {
        let errorModel = {
            nameError: "The name must be more than 3 characters long!"
            , emailError: "Email Error"
        };
        res.render('register', { model: errorModel })
    } else {
        await dbo.collection("Account").insertOne(data);
        res.redirect('/allUser');


    }
})
app.get("/allUser", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    let result = await dbo.collection("Account").find({}).toArray();
    res.render("allUser", { model: result });
})

app.get('/remove', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    await dbo.collection("Account").deleteOne({ _id: ObjectID(id) });
    res.redirect('/');
})
//=================================================================
app.post('/doinsert', async(req,res)=>{
    let client = await MongoClient.connect(url);
    let inputName = req.body.txtNameProduct;
    let inputPrice = req.body.txtPrice;
    let dbo = client.db("ToysDB");
    let data = {
        Name: inputName,
        Price: inputPrice
    }
    await dbo.collection("Product").insertOne(data);
        res.redirect('/allProduct');

})
app.get("/allProduct", async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToysDB");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render("allProduct", { items: result });
})
app.get('/removeProduct', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToysDB");
    await dbo.collection("Product").deleteOne({ _id: ObjectID(id) });
    res.redirect('/allProduct');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running in 3000 port");
});