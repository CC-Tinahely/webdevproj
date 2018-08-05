var express = require("express"); // call the express module which is default provided by Node
var app = express(); // now we need to declare our app which is the invoked express application
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
var fs = require('fs');
app.set ('view engine', 'jade');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var mysql = require('mysql');

app.use(express.static("scripts")); 
app.use(express.static("images"));
app.use(express.static("models"));

var reviews = require("./models/reviews.json")

const db = mysql.createConnection({
  host: 'den1.mysql4.gear.host', 
  user: 'ccsbookcase',
  password:'Sp0eW5!8F?V6',
  database: 'ccsbookcase'
   });

db.connect ((err) =>{
  if(err){
    console.log("This is your fault, you broke the database")
  }
  else{
    console.log("Boom! Database is up and running!")
  }
});

// Create a db table

app.get('/createtable', function(req,res){
  let sql = 'CREATE TABLE products (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Title varchar(255), Author varchar(255), Image varchar(255), Description text, Category varchar(255));'
  let query = db.query(sql,(err,res)=>{
    if (err) throw err;
    console.log(res);
    
  });
  res.send("your table is ready")
  
}); 

//end create table

// SQL Insert Data 
app.get('/insert', function(req,res){
  let sql = 'INSERT INTO products (Title, Author, Image, Description, Category) VALUES ("William the Superman", "Richmal Crompton", "green3sup.png", "William and the Outlaws prepare for a new civilization, start an Adventure Society and help Violet Elizabeth search for a new mother", "green");'
  let query = db.query(sql,(err,res)=>{
    if (err) throw err;
    console.log(res);
    
  });
  res.send("Item Created ... whooooot!")
  
}); 

// SQL QUERY
app.get('/queryme', function(req,res){
  let sql = 'SELECT * FROM products'
  let query = db.query(sql,(err,res)=>{
    if (err) throw err;
    console.log(res);
    
  });
  res.send("Look in the console")
  
}); 


// set up simple hello world application using the request and response function
app.get('/', function(req, res) {
//  res.send("Hello World"); // we set the response to send back the string hello world
res.render('index', {root: VIEWS});  
console.log("Hello World"); // used to output activity in the console
});

// function to render products page
app.get('/products', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  let sql = 'SELECT * FROM products;'
  let query = db.query(sql, (err, res1) =>{
    if(err)
      throw(err);
  
  res.render('products', {root: VIEWS, res1}); //use render command so that response object renders a html page
  
});
  console.log("Now you are on the products page");
});



//function to render the items page
app.get('/item/:id', function(req, res){
  let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
  let query = db.query(sql, (err, res1) =>{
    if(err)
      throw(err);
  
  res.render('item', {root: VIEWS, res1}); //use render command so that response object renders a html page
  });
  console.log("what a thing of beauty"); 
});

// create product page
app.get('/create', function(req, res) {
res.render('create', {root: VIEWS});  
console.log("Adding a book, eh?"); // used to output activity in the console
});

// create product page functionality
app.post('/create', function(req, res) {
  var title = req.body.title
let sql = 'INSERT INTO products (Title, Author, Image, Description, Category) VALUES ("'+title+'", "'+req.body.author+'", "'+req.body.image+'", "'+req.body.description+'", "'+req.body.category+'");'
let query = db.query(sql,(err,res)=>{
if (err) throw err;
console.log(res);
  });
  res.render('index', {root: VIEWS});
});

// function to edit database adta based on button press and form

app.get('/edit/:id', function(req, res){
 let sql = 'SELECT * FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
  res.render('edit', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
 });
 console.log("Look at you, Chief Editor");
});

app.post('/edit/:id', function(req, res){
let sql = 'UPDATE products SET Title = "'+req.body.newtitle+'", Author = "'+req.body.newauthor+'", Image = "'+req.body.newimage+'", Description = "'+req.body.newdescription+'", Category = "'+req.body.newcategory+'" WHERE Id = "'+req.params.id+'";'
let query = db.query(sql, (err, res) =>{
 if(err) throw err;
 console.log(res);
})
res.redirect("/item/" + req.params.id);
});

 // function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){

 let sql = 'DELETE FROM products WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)

  throw(err);
  res.redirect('/products'); // use the render command so that the response object renders a HHTML page
 });
 console.log("Its Gone!");
});

// red book category
app.get('/red', function(req, res) {
   let sql = 'SELECT * FROM products WHERE category= "red";'
  let query = db.query(sql, (err, res3) =>{
    if(err)
      throw(err);
res.render('red', {root: VIEWS, res3});
      });
console.log("All Red faced"); // used to output activity in the console
});

// blue book category
app.get('/blue', function(req, res){
  let sql = 'SELECT * FROM products WHERE category= "blue";'
  let query = db.query(sql, (err, res2) =>{
    if(err)
      throw(err);
    res.render('blue', {root: VIEWS, res2}); //use render command so that response object renders a html page
  });
  console.log("a bunch of blue books"); 
});

// green book category
app.get('/green', function(req, res) {
 let sql = 'SELECT * FROM products WHERE category= "green";'
  let query = db.query(sql, (err, res4) =>{
    if(err)
      throw(err);
    res.render('green', {root: VIEWS, res4}); //use render command so that response object renders a html page
  });  
console.log("it's not easy being green"); // used to output activity in the console
});

// yellow book category
app.get('/yellow', function(req, res) {
let sql = 'SELECT * FROM products WHERE category= "yellow";'
  let query = db.query(sql, (err, res5) =>{
    if(err)
      throw(err);
    res.render('yellow', {root: VIEWS, res5}); //use render command so that response object renders a html page
  });  
console.log("we all live in a yellow submarine"); // used to output activity in the console
});

//JSON STUFF
app.get('/suggestions', function(req, res){
  res.render("suggestions", {reviews:reviews});
  console.log("show me your suggestions")
});

// route to render add JSON page

app.get('/add', function(req, res){
  res.render('add', {root: VIEWS});
  console.log("Now you are leaving feedback!");
});

// post request to add JSON REVIEW
app.post('/add', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);

	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	function getMax(reviews , id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
		}
		return max;
	}

	var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only

	// create a new review based on what we have in our form on the add page 

	var review = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		content: req.body.content, // content called from the add.jade page textbox
	};
		console.log(review) // Console log the new product 
	var json  = JSON.stringify(reviews); // Convert from object to string
	
  // The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
	if (err){
	throw(err);}
    else {
		reviews.push(review); // add the information from the above variable
		json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
	fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
	}});
	res.redirect("/suggestions")
});

//edit suggestion
app.get('/editsuggestion/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
 }

 console.log("Id of this review is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indOne = reviews.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne
 res.render('editsuggestion' , {indOne:indOne});
  console.log("Let's edit");

 }); 
  
app.post('/editsuggestion/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = reviews; // declare data as the reviews json file
 var index = data.map(function(review){review.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit

  //var x = req.body.name;

 var y = req.body.content
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/suggestions");
});

//delete review
app.get('/deletereview/:id', function(req, res){

 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = reviews;
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)

 reviews.splice(index, 1);
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/suggestions");
});

//search function
app.post('/search', function(req, res){
 let sql = 'SELECT * FROM products WHERE Title LIKE "%'+req.body.search+'%";'
 let query = db.query(sql, (err,res1) =>{
  if(err)
  throw(err);

 // res.redirect("/error")
  res.render('products', {root: VIEWS, res1});
  console.log("Search for the hero inside yourself")
 });


});
  
// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("well, at least I've got this running...5 marks?");
  
});

