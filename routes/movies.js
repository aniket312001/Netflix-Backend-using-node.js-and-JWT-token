const router = require('express').Router()
const verify = require('../verify_token')
const Movie = require('../Models/Movies')


router.post('/',verify,async (req,res)=>{
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);

        try {
            const savedMovie = await newMovie.save();
            res.status(201).json(savedMovie);
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        res.status(403).json("You are not allowed to add movies!");
    }
})


router.get('/',async (req,res)=>{   // we can also set this in try catch
    const movies = await Movie.find()
    res.status(201).json(movies)
})


router.get('/:id',async (req,res)=>{
    const movies = await Movie.findById(req.params.id)
    res.status(201).json(movies)
})


router.delete('/:id',verify,async (req,res)=>{
    if(req.user.isAdmin){
        await Movie.findByIdAndDelete(req.params.id)
        res.status(201).json("Data Deleted Successfully ...")
    }
    else {
        res.status(403).json("You are not allowed to Delete movies!");
    }
})

router.put('/:id',verify,async(req,res)=>{
    if(req.user.isAdmin){
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedMovie);
    }
    else {
        res.status(403).json("You are not allowed to update movies!")
    }
})

// Get all movie by gener
// we can also genre in passing in param but now lets try in query param 

router.get('/getByGenre/',async (req,res)=>{

    const {genre} = req.query
    const queryObject = {}

    if(genre){
        queryObject.genre = {$regex:genre,$options:'i'}
    }

    const movies = await Movie.find(queryObject)
    res.status(201).json(movies)

})


module.exports = router;