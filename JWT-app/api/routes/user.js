const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const json = bodyParser.json();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = require('../../app');

router.post('/signup',json,(req,res,next) => {
    User.find({
        email: req.body.email
    }).then((result) => {
        if(result.length != 0) {
            res.status(409).json({
                message: 'User already exists'
            });
        } else {
            bcrypt.hash(req.body.password,10,function(err,hash) {
                if(err) {
                    res.status(404).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
        
                    user.save().then((result) => {
                        console.log(result);
                        res.status(200).json({
                            message: 'User added successfully',
                        });
                    }).catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

router.get('/login',json,(req,res,next) => {
    //console.log(req.body.email);
    User.find({
        email: req.body.email
    }).then((result) => {
        console.log(result);
    })
    //console.log(result);
    res.status(200).json({
        message: 'All Records'
    });
});

router.post('/login',json,(req,res,next) => {
    User.find({
        email: req.body.email
    }).then((user) => {
        if(user.length == 0) {
            res.status(401).json({
                message: "User doesn't exist"
            });
        }

        bcrypt.compare(req.body.password,user[0].password,function(err,result) {
            if(err) {
                res.status(401).json({
                    message: "Auth Error"
                })
            }

            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.SECRET_TOKEN,
                {
                    expiresIn: "1h"
                });
                res.status(200).json({
                    message: "User logged in successfully",
                    token: token
                });
            }
            else {
                res.status().json({
                    message: "Password doesn't match with records"
                });
            }
        });
    });
});

router.delete('/:uid',(req,res) => {
    const userId = req.params.uid;
    User.deleteOne({
        _id: userId
    }).then(() => {
        res.status(200).json({
            message: 'Record deleted'
        });
    });
})

module.exports = router;