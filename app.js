const express=require('express');
const morgan=require("morgan");
const moongose=require("mongoose");
const { default: mongoose } = require('mongoose');
const Blog=require("./models/blog");
const { result } = require('lodash');
const { render } = require('ejs');



//baza mongob i spajanje preko moongosea
const dbu='mongodb+srv://LJubicIvan:ljubicivan@cluster0.2xvgt6k.mongodb.net/cluster0?retryWrites=true&w=majority'
mongoose.connect(dbu,{useNewUrlParser:true,useUnifiedTopology:true}).then((result) => app.listen(3000))
.catch(err => console.log(err));






//express app
const app=express();
//register view engine
app.set("view engine",'ejs');
//listen na portu 3000

//middleware
app.use(express.static('public'))
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}))

//interakcija s bazom

app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  })

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});


app.get('/single-blog', (req, res) => {
  Blog.findById('5ea99b49b8531f40c0fde689')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

//post slanje na bazu

app.post('/blogs',(req,res)=>{
    const blog=new Blog(req.body);

    blog.save()
    .then((result)=>{
        res.redirect('/blogs')
    })
    .catch((err)=>{
      console.log(err)
    })
})



//get uzima dva argzumenta,,rutu i req res
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});
  
  app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
  });

  app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.get('/blogs/:id',(req,res)=>{
    const id=req.params.id
    Blog.findById(id)
      .then(result=>{
          res.render('details',{blog:result,title:'Blog Details'})
      })
      .catch(err=>{
        console.log(err)
      })
  })

  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

  app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  // 404 page
  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });