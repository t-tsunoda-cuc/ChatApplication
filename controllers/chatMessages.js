const chatMessageRouter = require('express').Router()
const ChatMessage = require('../models/chatMessage')

chatMessageRouter.get('/', async(req,res,next) => {
  try{
    const chatMessage = await ChatMessage.find().populate('user')
    return res.status(200).json(chatMessage)
  }catch(error){
    next(error)
  }
})

chatMessageRouter.get('/:_id', async(req,res,next) => {
  try{
    const chatMessage = await ChatMessage.findById(req.params._id).populate('user')
    if(chatMessage === null){
      return res.status(404).json({ message: `ChatMessage with id ${req.params._id} not found` })
    }
    return res.status(200).json(chatMessage)
  }catch(error){
    next(error)
  }
})

chatMessageRouter.post('/', async (req, res,next) => {
  const body = req.body
  try {
    const chatMessage = new ChatMessage({
      user: body.user,
      message_text: body.message_text,
      message_time: new Date()
    })
    const savedChatMessage = await chatMessage.save()
    res.status(201).json(savedChatMessage)
  } catch (error) {
    next(error)
  }
})

chatMessageRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const exsistingChatMessage = await ChatMessage.findById(req.params._id)
    if(exsistingChatMessage === null){
      return res.status(404).json({ message: `ChatMessage with id ${req.params._id} not found` })
    }

    const updateChatMessage ={
      user: body.user,
      message_text: body.message_text,
      message_time: new Date().toLocaleDateString()
    }

    const updateResponse = await ChatMessage.findByIdAndUpdate(req.params._id,updateChatMessage,{ new: true })
    return res.status(200).json(updateResponse)
  } catch (error) {
    next(error)
  }
})

chatMessageRouter.delete('/:_id', async(req,res,next) => {
  try{
    await ChatMessage.findByIdAndDelete(req.params._id)
    return res.status(204).end()
  }catch(error){
    next(error)
  }
})

module.exports = chatMessageRouter