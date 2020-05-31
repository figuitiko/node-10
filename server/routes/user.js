
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');

const {checkToken, checkRole} = require('../middlewares/authentication')

const app = express();

app.get('/user',checkToken, (req, res) => {
   
    
    
    let from = req.query.from || 0;
    from =Number(from);

    let max = req.query.limit || 5;
    max = Number(max);



    User.find({status:true})
        .skip(from)
        .limit(max)
        .exec( (err, users)=>{
            if(err){
                return  res.status(400).json({
                      ok: false,
                      err
                  })
              }

              User.count({},(err, counter)=>{
                res.json({
                    ok: true,
                    users,
                    counter
                });
              })

              
        })

} )
app.post('/user',[checkToken, checkRole], (req, res) =>{

    let body = req.body;
  

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10) ,
        role: body.role,
    
    });

    user.save((err, userDb)=> {
        if(err){
          return  res.status(400).json({
                ok: false,
                err
            })
        }
        


        res.json({
            ok: true,
            user: userDb
        })
    
    });

    // if(body.name === undefined){
    //     res.status(400).json({
    //         ok: false,
    //         msg: 'the name is mandatory'
    //     })
    // }else{
    //     res.json({
    //         body
    //     })
    // }
    
} )
app.put('/user/:id',[checkToken, checkRole], (req, res) =>{
    
   let id = req.params.id;

   let body = _.pick(req.body, ['name', 'email','img','role','status' ]);

   User.findByIdAndUpdate(id,body,{new: true, runValidators: true},(err,userDb)=>{

        if(err) {
           return  res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            user:userDb
        });


   })
    
    
} )
app.delete('/user/:id',[checkToken,checkRole], (req, res) =>{
    
    
    let id = req.params.id;
    //User.findByIdAndRemove(id,(err, userDeleted)=>{

    let changeStatus = {
        status: false
    }

    User.findByIdAndUpdate(id,changeStatus,{new: true},(err, userDeleted)=>{
        if(err) {
            return  res.status(400).json({
                 ok: false,
                 err
             })
         }
         if(!userDeleted){
            return  res.status(400).json({
                ok: false,
                err: {
                    msg: 'user not found'
                }
            })
         }

         res.json({
             ok: true,
             user: userDeleted
         });
    });


} )


module.exports = app;