const express = require('express');
const bodyParser = require('body-parser');
const expressHandle = require('express-handlebars');
const Redis = require('redis');
const MethodOverride = require('method-override');
const path = require('path');

// const port_redis = process.env.PORT || 6379;
//create a redis client
let client = Redis.createClient({host:'localhost'});

//when redis running notify
client.on('connect',()=>{
    console.log("redis is running!!");
});

//if any error prints below code
client.on('error',(err)=>{
    console.log(err);
});

const port = 3000

app = express();

//View engine
app.engine('handlebars', expressHandle({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Used to parse the json data
app.use(bodyParser.json());

//used to parsing the url encoded data
app.use(bodyParser.urlencoded({extended:false}));

//Method Override
app.use(MethodOverride('_method'));

//All the paths to the web page are defined here
//Home page is opened whenever apps load
app.get('/',(req,res,next)=>{
    res.render('searchusers');
});

//search process
app.post('/user/search',(req,res,next)=>{
    //retrieve the id from the request
    //input field's name should be id inorder to access over here
    const id = req.body.id;
    //hgetall gets all fields and values in a hash for that id
    client.hgetall(id, (err, obj)=>{
        //if no object for that id present
        if(!obj){
            res.render('searchusers',
            //if no user with that id exist throw error
            {
                error:"user do not exist"
            });
            console.log(err);
        }else{
            obj.id = id
            res.render('details', 
            //renders the user with that object
            {
                user:obj
            });
        }

    })

})

// for rendering the add user page use get method
app.get('/user/add',(req,res,next)=>{
    res.render('addusers');
    // const {id, fname, lname, email, phone} = req.body

})

//process the info from the above page 
app.post('/user/add',(req,res,next)=>{
    const {id, first_name, last_name, email, phone} = req.body
    client.hmset(id,    
        [
            'first_name', first_name,
            'last_name', last_name,
            'email', email,
            'phone', phone
        ],
        (err,reply)=>{
            if(err){
                console.log(err);
            }else{
            console.log(reply);
            //takes you to the home page
            res.redirect('/');
            }
            
        }
    )
});

app.get('/user/update',(req,res,next)=>{
    res.render('updateusers');
});

app.post('/user/update',(req,res,next)=>{
    const id = req.body.id;
    client.hgetall(id,(err,obj)=>{
        if(!obj){
            res.render("updateusers",{
                error : "User not exist"
            }
            )
        }else{
            user = obj  
            //getting the updated names from the form field.
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const email = req.body.email;
            const phone = req.body.phone;
            //you can use hmset or hset for updation
            //redis will just overwrite the values of the field mentioned,
            //and if field is not present it'll create new one and insert the data
            client.hmset(id,
                {
                    'first_name':first_name,
                    'last_name': last_name,
                    'email':email,
                    'phone':phone

                },
                (err,reply)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(reply);
                        res.redirect('/');
                    }
                    
                }
                )
        }
    }) 
})


app.delete('/user/delete/:id',(req,res,next)=>{
    client.del(
        //if the data is sent in the url used the params instead of body
        req.params.id
    );
    res.redirect('/');
})

app.listen(port, ()=>(console.log(`Server started on port: ${port}`)));
