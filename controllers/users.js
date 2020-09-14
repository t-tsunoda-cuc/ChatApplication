const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res,next) => {
  try{
    const user = await User.find()
    return res.status(200).json(user)
  }catch(error){
    next(error)
  }
})
userRouter.get('/:_id', async(req,res,next) => {
  try{
    const user = await User.findById(req.params._id)
    if(user === null){
      return res.status(404).json({ message: `User with id ${req.params._id} not found` })
    }
    return res.status(200).json(user)
  }catch(error){
    next(error)
  }
})

userRouter.post('/', async (req, res,next) => {
  const body = req.body
  try {
    const user = new User({
      user_name: body.user_name,
      user_icon: body.user_icon,
      user_isTeacher: body.user_isTeacher
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const exisitingUser = await User.findById(req.params._id)
    if(!exisitingUser){
      return res.status(404).json({ message: `user with id ${req.params._id} not found` })
    }

    const updateUser = {
      user_name: body.user_name,
      user_icon: body.user_icon,
      user_isTeacher: body.user_isTeacher
    }

    const updateResponse = await User.findByIdAndUpdate(req.params._id,updateUser,{ new: true })
    return res.status(200).json(updateResponse)
  } catch (error) {
    next(error)
  }
})

userRouter.delete('/:_id', async(req,res,next) => {
  try{
    await User.findByIdAndDelete(req.params._id)
    return res.status(204).end()
  }catch(error){
    next(error)
  }
})

module.exports = userRouter