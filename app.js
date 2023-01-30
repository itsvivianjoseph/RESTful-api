const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

const PORT = process.env.PORT || 3000 ; 

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewurlParser:true});
mongoose.set('strictQuery', true);

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
    .get(function(req,res){
        Article.find(function(err,foundArticles){
            if(err){
                res.send(err);
            }else{
                res.send(foundArticles);
            }
        });
    })
    .post(function(req,res){
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content 
        });
        newArticle.save(function(err){
            if(err){
                res.send(err);
            }else{
                res.send("successfully posted!");
            }
        });
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(err){
                res.send(err);
            }else{
                res.send("successfully deleted the entry");
            }
        })
    });

app.route("/articles/:articleTitle")
    .get(function(req,res){
        Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
            if(err){
                res.send(err);
            }else{
                res.send(foundArticle);
            }
        })
    })
    .put(function(req,res){
        Article.findOneAndUpdate(
            {title : req.params.articleTitle} , 
            {title : req.body.title , content : req.body.content} , 
            {overwrite : true},
            function(err,result){
                if(err){
                    res.send(err);
                }else{
                    res.send("successfully done put request!");
                }
            }
        )
    })
    .patch(function(req,res){
        Article.findOneAndUpdate(
            {title : req.params.articleTitle} , 
            {$set : req.body},
            function(err){
                if(err){
                    res.send(err);
                }else{
                    res.send("successfully done patch request!");
                }
            }            
        )
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title : req.params.articleTitle},
            function(err){
                if(err){
                    res.send(err);
                }else{
                    res.send("successfully done delete one request!");
                }
            }
        )
    });

app.listen(PORT,function(){
    console.log("your listening on port 3000");
});