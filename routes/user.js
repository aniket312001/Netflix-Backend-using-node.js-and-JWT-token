const router = require('express').Router()
const User = require('../Models/User')
const cryptoJs = require('crypto-js')
const verify = require('../verify_token')

//Update User


router.put('/:id',verify, async (req,res)=>{
    if(req.user.id == req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = cryptoJs.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString()
            
        }

        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true}) 
            res.status(200).json(updateUser)

        } catch(e){
            res.status(505).json(e)
        }
    
    
    } else {
        res.status(403).json("You are not Authorized to update other user account ")
    }
})

// Get User

router.get('/find/:id', async (req,res)=>{
        try{
            const user = await User.findById(req.params.id) 

            const {password, ...other} = user._doc  // for not getting password
        res.status(200).json({...other})

        } catch(e){
            res.status(505).json(e)
        }
    
    })



// Delete

router.delete('/:id',verify, async (req,res)=>{
    if(req.user.id == req.params.id || req.user.isAdmin){
        
        try{
            await User.findByIdAndDelete(req.params.id) 
            res.status(200).json("User has been deleted...")

        } catch(e){
            res.status(505).json(e)
        }
    
    
    } else {
        res.status(403).json("You are not Authorized to delete other user account ")
    }
})



// Get All user


router.get("/", verify, async(req, res) => {
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ? 
            await User.find().sort({ _id: -1}).limit(5) : 
            await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You are not authorized to see all users");
    }
})


// or 

// router.get("/", verify, async(req, res) => {
//     
//     if(req.user.isAdmin){
//         try {
//             const users =await User.find()
//             res.status(200).json(users)

//         } catch (error) {
//             res.status(500).json(error);
//         }
//     } else {
//         res.status(403).json("You are not authorized to see all users");
//     }
// })




//GET USER STATS
router.get("/stats", async(req, res) => {
    try {
        const data = await User.aggregate([
            { $project: { month: { $month: "$createdAt" }}},
            { $group: { _id: "$month", total: { $sum: 1 }}}
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;