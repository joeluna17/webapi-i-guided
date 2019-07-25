const express = require('express');
const db = require('./data/hubs-model.js');

const server = express()
;
//the http verb here is get and this has to do with crud process. the handler returns
// the function that returns a repsponse and the conumes a request as below

server.use(express.json());  // this uses json on every verb or method so that it return a verbose object saying what happened


server.get('/', (request, response) => {
    response.send('Hello world from express!!');
}) 

server.get('/now', (req, res) => {
    const now = new Date().toISOString();
    res.send(now)
});

//Getting data from and database
server.get('/hubs', (req, res)=> {
    db.find()
    .then(hubs => {
        res.status(200).json(hubs);
    })
    .catch(err => {
        res.status(500).json({success:false, err});
    })
});


//POSTING or adding to db
server.post('/hubs',(req, res)=>{
    //POST /hubs {name: somename}
    const hubInfo = req.body;
    console.log(hubInfo)

    db.add(hubInfo)
    .then(hub => {
        res.status(201).json({success: true, hub})
    })
    .catch(err => {
        res.status(500).json({success:false, err})
    })
})

//UPDATE we use PUT verb for best practice/industry standard

server.put('/hubs/:id', (req, res) => {
    const {id} = req.params;
    const hubInfo = req.body;
    db.update(id, hubInfo)

    .then(updated => {
        if(updated){
            res.status(200).json({success:true, updated})
        } else{
            res.status(404).json({success:false, message: 'I cannot find the data you are looking for'})
        }
    })
    .catch(err =>{
        res.status(500).json({success:false, err})
    })
})

//DELETE

server.delete('/hubs/:id', (req, res) =>{
    //DELETE /hubs/<id>
    const {id} = req.params;
    db.remove(id)
    .then(deleted => {
        if(deleted){
            res.status(204).end(); // we dont want to send anything else but the 204 we dont need to return anything esle
        }else{
            res.status(404).json({success:false, message:'these are not the hubs you are looking for.'})
        }
    })
    .catch(err => {
        res.status(500).json({success:false, err})
    })
})

//GETTING data by id

server.get('/hubs/:id', (req,res)=> {
    const {id} = req.params;
    db.findById(id)
    .then(hub=> {
        if(hub){
        res.status(200).json({success:true, hub})
        }else{
            res.status(404).json({success:false, message:"Item with that id not found"})
        }
    })
    .catch(err => {
        res.status(500).json({success:false, err})
    })
})





server.listen(4000, ()=>{
    console.log("server listening on port 4000");
});