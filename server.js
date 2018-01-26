var express = require("express");
var app = express();
var request = require("request");
var JFile = require("jfile");
var url = 'https://newsapi.org/v2/everything?' +
          'q=cryptocurrency&' +
          'apiKey=8c553c1ce53a433ca7434c77bf8ed27a';
var bodyParser = require('body-parser');
var pg = require('pg');
var morgan = require('morgan');
var data;

//pool for articles
var pool = new pg.Pool({
    port:5433,
    password: 'rakhra22',
    database: 'newAppdb',
    max:10,
    host: 'localhost',
    user: 'postgres'  
});

//pool for notes
var pool2 = new pg.Pool({
    port:5433,
    password: 'rakhra22',
    database: 'recipes',
    max:10,
    host: 'localhost',
    user: 'postgres'  
});

//function to insert all articles into the db
function insertDb(articles){

    pool.connect((err,db,done) =>{
        if(err) throw err;

        for(i=0; i<articles.length; i++){
            //use values to prevent sql injections
            db.query('INSERT INTO articles (id, url, description) VALUES($1, $2, $3)',[i, articles[i].url, articles[i].description],(err,table)=>{
                done();
                if(err){
                    console.log(err);
                }else {
                    console.log('Data Inserted');
                    
                }
            })
        }
    })
}

function insertApiData(){
    
    pool.connect((err, db, done)=> {
        if(err) {
            return console.log(err);
        }else {
            db.query('SELECT * FROM articles',(err,table)=>{
                if(err){
                    return console.log(err);
                }else {
                    // console.log(table.rowCount);
                    if(table.rowCount === 0){
                        request(url,function(error,response,body){
                            articlesJson = JSON.parse(body);
                        })
                        articles = articlesJson.articles;
                        
                        insertDb(articles);
                    }
          
                }
            })
        }
        
    })

}

//function to get data from db
function getFromDb(){
    var articles = [];
    pool.connect((err, db, done)=> {
        if(err) {
            return console.log(err);
        }else {
            this.articles = db.query('SELECT * FROM articles',(err,table)=>{
                if(err){
                    return console.log(err);
                }else {
                    this.articles = table.rows;
                    return this.articles;
                }
            })
            console.log(this.articles);
        }
    })
}
//parser function 
function trendCounter(description){
    var positiveCounter=0;
    var negativeCounter=0;
    var neutralCounter=0;
    var fileNamePos;
    var fileNameNeg;
    var posWords;
    var negWords;
    var results;
    var tempString;
    var descripArray = [];
    var urlArray = [];
    fileNamePos = process.argv[2];
    fileNameNeg = process.argv[3];
    var file = new JFile(fileNamePos);
    var file2 = new JFile(fileNameNeg);

    //confirm correct arguments
    if (process.argv.length < 3) {
        console.log('Usage: node ' + process.argv[1] + ' FILENAME');
        process.exit(1);
    }
    
    //decalaring file names
    posWords = file.lines;
    negWords = file2.lines;
    console.log(description);

    //loop that looks for matches
    for(i = 0; i < description.length; i++){
        tempString = description[i].description;
        descripArray[i] = description[i].description;
        urlArray[i] = description[i].url;
        if(tempString != null){
            var tokens = tempString.split(" ");
        }
        for(var j in tokens){
            for(k = 0; k < posWords.length; k++){
                if(posWords[k].toUpperCase() == tokens[j].toUpperCase()){
                    positiveCounter++;
                }
            }
            for(z = 0; z < negWords.length; z++){
                if(negWords[z].toUpperCase() == tokens[j].toUpperCase()){
                    negativeCounter++;
                }
            }
        }
    }
    neutralCounter = description.length - (positiveCounter + negativeCounter);
    
    results={
        positive: positiveCounter,
        negative: negativeCounter,
        neutral: neutralCounter,
        data: [
            {name: 'Articles', pos: positiveCounter, neg:negativeCounter, neutral:neutralCounter}
        ],
        url: urlArray
    }
    return results;
}

app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

request(url,function(error,response,body){
    articlesJson = JSON.parse(body);
})

app.get('/api', function(req, res) {
    var descriptions= [];
    var articles;
    insertApiData();    
    description = getFromDb();
    console.log(descriptions);
    articles = trendCounter(descriptions );
    res.json(articles);
});

app.get('/api/articles',function(req,res) {
    pool.connect((err, db, done)=> {
        done();
        if(err) {
            return console.log(err);
        }else {
            db.query('SELECT * FROM articles',(err,table)=>{
                if(err){
                    return console.log(err);
                }else {
                    var articles = trendCounter(table.rows);
                    console.log(articles);
                    res.json(articles);
                }
                
            })
        }
    })
});

app.get('/api/recipes',function(req,res) {
    pool2.connect((err, db, done)=> {
        done();
        if(err) {
            return console.log(err);
        }else {
            db.query('SELECT * FROM notes',(err,table)=>{
                if(err){
                    return console.log(err);
                }else {
                    var recipes = table.rows;
                    console.log(recipes);
                    res.send(recipes);
                }
                
            })
        }
    })
});

app.post('/api/notes/newNote',function(req,res) {
    var name = req.body.data.name;
    var id = req.body.data.id;

    pool2.connect((err, db, done)=> {
        done();
        if(err) {
            return res.status(400).send(err);
        }else {
            db.query('INSERT INTO notes (id,name) VALUES($1,$2)',[id,name],(err,table)=>{
                done();
                if(err){
                    res.status(400).send(err);
                }else {
                    res.status(201).send({message:"Data Inserted"});
                }
                
            })
        }
    })
});

app.delete('/api/recipes/deleteRecipe/:id',function(req,res){
    var id = req.body.id;
    
    pool2.connect((err, db, done)=> {
        done();
        if(err) {
            return res.status(400).send(err);
        }else {
            db.query('DELETE FROM recipes WHERE id=$1',[id],(err,table)=>{
                done();
                if(err){
                    res.status(400).send(err);
                }else {
                    res.status(201).send({message:"Data deleted"});
                }
                
            })
        }
    })
})

app.listen(3001, function() {
    console.log("Server Started");
});
