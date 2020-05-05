const defaultcntrl={
    default: function(req,res){
        res.send("welcome to jobs").status(200);
    }
}

module.exports=defaultcntrl;