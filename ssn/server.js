// ---- EXPRESS JS - Framework

let SSN_MODULE = require('../mouhamad_faizan/ssn');

let express = require('express'),
    app = express();

// ------------------------
// middleware
// ------------------------
// - body-parser needed to catch and to treat information inside req.body
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

let mongoose = require('mongoose');

let person = require('../mouhamad_faizan/model');

let request = require('request');


// ------------------------
// LIST ROUTE
// ------------------------
app.post("/people/",(req,res)=>{

    const myModel = mongoose.model('People');

    myModel.createPerson(req.body).then((person)=>{
        new myModel(person).save().then((result)=>{
            res.status(200).json({result : result, people : person})
        },(err)=>{
            res.status(400).json(err)
        })
    })

});

app.get("/people/",(req,res)=>{
    mongoose.model('People').find({}).then((result)=>{
        res.status(200).json(result)
    },(err)=>{
        res.status(400).json(err)
    })
});

app.get("/people/:id",(req,res)=>{
    mongoose.model('People').find({_id: req.params.id}).then((result)=>{
        res.status(200).json(result)
    },(err)=>{
        res.status(400).json(err)
    })
});

app.delete("/people/:id",(req,res)=>{
    mongoose.model('People').find({_id: req.params.id}).remove().then((result)=>{
        res.status(200).json(result)
    },(err)=>{
        res.status(400).json(err)
    })
});

app.put("/people/:id",(req,res)=>{
    const myModel = mongoose.model('People');
    let newPeople = new myModel(req.body);
    mongoose.model('People').find({_id: req.params.id}).remove().then((result)=>{
        newPeople.save().then((result)=>{
            res.status(200).json({result : result, people : newPeople})
        },(err)=>{
            res.status(400).json(err)
        })
    })
});


// ------------------------
// START SERVER
// ------------------------
app.listen(3011,function(){
    console.info('HTTP server started on port 3011');
});