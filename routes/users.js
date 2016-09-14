var express=require('express');
var router=express.Router();

var mongojs=require('mongojs');
var db=mongojs('localhost:27017/Projects',['users','project'])

// Methods For User
// To create User 
router.get('/user',function(req,res){
   var response={
     username:req.query.username,
     position:req.query.position,
   }
  
  // To insert user data
   db.users.insert(response,function(err,result){
     if(err)throw err;
      res.send('data inserted')
   });
});

// To View User Account Or Developer View
router.get('/userView',function(req,res){
   db.users.find({username:req.query.username},function(err,result){
     if(err)throw err;
     else{res.send(result)}
   });
});

// To view Manager Account
router.get('/managerView',function(req,res){
    db.users.find({username:req.query.username,manager:'true'},function(err,result){
        if(err)throw err;
        else{
              if(result.length){
                    db.project.find({ProjectName:result[0].ProjectManagerFor},function(err,result1){
                        if(err)throw err;
                        else{
                          res.send(result1);
                        }
                    });
                    // res.send(result[0].ProjectManagerFor);
                 
              }else{
                res.send('manager access denied');
               
              }          
        }
    });
});

module.exports=router;