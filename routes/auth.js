const router = require('express').Router()
const User = require('../Models/User')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')


// Register
router.post('/register',async (req,res)=>{
    const userData = new User({
        username:req.body.username,
        email:req.body.email,
        password: cryptoJs.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString()
    
    })

    try{
        const user = await userData.save()
        res.status(201).json(user)
    } catch(err){
        req.status(505).json(err) 
    }
})


// login

router.post('/login', async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        !user && res.status(401).json("Wrong password or Username")  // if email not found
   
        const bytes = cryptoJs.AES.decrypt(user.password,process.env.SECRET_KEY)
        const origPassword = bytes.toString(cryptoJs.enc.Utf8)
   
        origPassword !== req.body.password && res.status(401).json("Wrong password ")
    
        const accessToken = jwt.sign(
            {id:user._id,isAdmin:user.isAdmin},
            process.env.SECRET_KEY,
            {expiresIn:"5d"}
        )


        const {password, ...other} = user._doc
        res.status(200).json({...other,accessToken})
        
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;