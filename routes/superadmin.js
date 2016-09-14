var express=require('express');
var router=express.Router();

var mongojs=require('mongojs');
var db=mongojs('localhost:27017/Projects',['users','project']);

// Methods For SuperAdmin Access
router.get('/superadmin',function(req,res){

  var uname="superadmin";
  

      if(uname==req.query.username){
        res.send("Welcome...\n UserList Access : /superadmin/userDatabase\n ProjectList Access : /superadmin/projectDatabase for projects");

        }else{
          res.send("Access Denied Try Again...")
        }
  
  
 });


 // To create Project-User List
  router.get('/superadmin/createProject',function(req,res){
    var ProjectDetails={
      ProjectName:req.query.pname,
    }

    // To insert project data
   db.project.insert(ProjectDetails,function(err,result){
     if(err)throw err;
      res.send('Project Created')
   });

});



// To assign Projects to user
router.get('/superadmin/assign',function(req,res){
  
db.users.find({username:req.query.managername,manager:'true'},function(err,result){
  if(err)throw err;
  else{
         if(result.length){
                res.send("Manager not available... Already Assigned")
                }else{                  
     
            //  To Assign Users to Project
              db.project.find({ProjectName:req.query.pname},function(err,result){
                    if(result.length)
                    {          
                      db.project.update({ProjectName:req.query.pname},
                              {$addToSet:{users:req.query.username}},
                              function(err,result){
                              if(err)throw err;
                              }); 

                       db.project.find({ProjectName:req.query.pname},function(err,result1){
                          if(err)throw err; 
                          db.users.update({username:req.query.username},
                              {$addToSet:{projectname:[req.query.pname,{ProjectManager:result1[0].ProjectManager}]}},
                              function(err,result){
                              if(err)throw err;
                              });
                       })         
                     

                      res.send("Tasks Assigned")       
                      
                    }else{
                      res.send('Project Does Not Exist...!!! \n Create Project First...')
                    }
               });
                    
             }
        }
  
    });
 
    
                       
});



// To Assign Manager Access to user
 router.get('/superadmin/managerAccess',function(req,res){
        
   db.users.find({username:req.query.username,manager:'true'},function(err,result){
       if(err)throw err;

       if(result.length){
            res.send("Already Assigned For Other Project");
       }else{

            db.project.find({ProjectName:req.query.pname},function(err,result){
              if(result.length){

                     db.users.update({username:req.query.username},
                              {$set:{manager:'true',ProjectManagerFor:req.query.pname}},
                              function(err,result){
                               
                              });
                      db.project.update({ProjectName:req.query.pname},
                              {$set:{ProjectManager:req.query.username}},
                              function(err,result){
                                  res.send("Manager Access assigned to : "+req.query.username);
                              });

                    }else {
                             res.send('Project Does Not Exist...!!! \n Create Project First...')
                           }
                  });
             
            }
     
   });
});



// To Revoke Manager Access to user
 router.get('/superadmin/managerRevoke',function(req,res){
        
   db.users.find({username:req.query.username,manager:'true'},function(err,result){
       if(err)throw err;

       if(result.length){
              db.users.update({username:req.query.username},
                              {$set:{manager:'false',ProjectManagerFor:null}},
                              function(err,result){
                                 res.send("Manager Access Revoked From : "+req.query.username);
                              });
       }else{            

              res.send(req.query.username+" : has no Manager Access");
            }
     
   });
});



// SuperAdmin Access For User Database
router.get('/superadmin/userDatabase',function(req,res){
         //  Display User Database
   db.users.find(function(err,result){
       if(err)throw err;
      res.send(result);
   });
});



// SuperAdmin Access For Project Database
router.get('/superadmin/projectDatabase',function(req,res){
     // Display Project Database
    db.project.find(function(err,result){
       if(err)throw err;
       res.send(result);
   });
});

module.exports=router;