var express = require('express');       // Include for requesting and sending webpages.
var bodyParser = require('body-parser');    // Include for parsing html files
var mongoose = require('mongoose');     // Include for MongoDB Utility
var methodOverride = require('method-override'); // To override PUT or DELETE request under POST request
var expressSanitizer = require('express-sanitizer');


app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Connecting DB
mongoose.connect("mongodb://localhost/simple_blog",{useNewUrlParser:true});
//Creating a schema ()
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
}); 

//Creating a Collection inside the Schema

var Blog = mongoose.model("Blog",blogSchema);

//Routes : Representational Structures for Transfer

//Root Route

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,r)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
           // console.log(r);
            res.render("index",{blog:r});
        }
    });
});


app.get("/blogs/new",function(req,res){
    res.render("new");
});

//Show Route
app.get("/blogs/:id",function(req,res)
{
   // console.log(req.params.id);
    Blog.findById(req.params.id,function(err,Post){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show",{Blogs:Post});
        }
    });
});

// Edit Route
app.get("/blogs/:id/edit",function(req,res){
    //Requesting the blog info
    Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                console.log(err);
            }
            else
            {
                res.render("edit",{Blog:foundBlog});
            }
    });
});

//POST ROute

app.post("/blogs",function(req,res){
    //Just to check and remove script tags in text
   // console.log(req.body.blog.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
   // console.log(req.body.blog.body);
    Blog.create(req.body.blog,function(err,sol){
        if(err)
        {
            // Enter data again
            res.render("new");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

// PUT Routes

app.put("/blogs/:id",function(req,res){

        //Just to counter any script tags in the input
   // console.log(req.body.blog.body);

        req.body.blog.body = req.sanitize(req.body.blog.body);
    //console.log(req.body.blog.body);

        Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,foundBlog){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.redirect("/blogs/" + req.params.id);
                }
        });
});

app.delete("/blogs/:id",function(req,res){
    //remove and redirect

    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            console.log("cannot delete");
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,"localhost",function(){
    console.log("Server is Up!!");
});