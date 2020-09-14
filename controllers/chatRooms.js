const chatRoomRouter = require('express').Router()
const ChatRoom = require('../models/chatRoom')

chatRoomRouter.get('/', async(req,res,next) => {
  try{
    const chatRoom = await ChatRoom.find().populate('user message')
    return res.status(200).json(chatRoom)
  }catch(error){
    next(error)
  }
})

chatRoomRouter.get('/:_id', async(req,res,next) => {
  try{
    const chatRoom = await ChatRoom.findById(req.params._id).populate('user')
    if(chatRoom === null){
      return res.status(404).json({ message: `ChatRoom with id ${req.params._id} not found` })
    }
    return res.status(200).json(chatRoom)
  }catch(error){
    next(error)
  }
})

chatRoomRouter.post('/', async (req, res,next) => {
  const body = req.body
  try {
    const chatRoom = new ChatRoom({
      message: body.message,
      user: body.user
    })

    const savedChatRoom = await chatRoom.save()
    res.status(201).json(savedChatRoom)
  } catch (error) {
    next(error)
  }
})

chatRoomRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const exsistingChatRoom = await ChatRoom.findById(req.params._id)
    if(exsistingChatRoom === null){
      return res.status(404).json({ message: `ChatRoom with id ${req.params._id} not found` })
    }

    const updateChatRoom ={
      message: body.message,
      user: body.user
    }

    const updateResponse = await ChatRoom.findByIdAndUpdate(req.params._id,updateChatRoom,{ new: true })
    return res.status(200).json(updateResponse)
  } catch (error) {
    next(error)
  }
})

chatRoomRouter.delete('/:_id', async(req,res,next) => {
  try{
    await ChatRoom.findByIdAndDelete(req.params._id)
    return res.status(204).end()
  }catch(error){
    next(error)
  }
})

module.exports = chatRoomRouter