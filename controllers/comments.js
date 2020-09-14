const commentRouter = require('express').Router()
const Comment = require('../models/comment')

commentRouter.get('/', async(req,res,next) => {
  try{
    const comment = await Comment.find().populate('user')
    return res.status(200).json(comment)
  }catch(error){
    next(error)
  }
})

commentRouter.get('/:_id', async(req,res,next) => {
  try{
    const comment = await Comment.findById(req.params._id).populate('user')
    if(comment === null){
      return res.status(404).json({ message: `Comment with id ${req.params._id} not found` })
    }
    return res.status(200).json(comment)
  }catch(error){
    next(error)
  }
})

commentRouter.post('/', async (req, res,next) => {
  const body = req.body
  try {
    const comment = new Comment({
      user: body.user,
      comment_text: body.comment_text,
      comment_time: new Date().toLocaleDateString()
      ,
      likes: body.likes
    })

    const savedComment = await comment.save()
    res.status(201).json(savedComment)
  } catch (error) {
    next(error)
  }
})

commentRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const exsistingComment = await Comment.findById(req.params._id)
    if(exsistingComment === null){
      return res.status(404).json({ message: `Comment with id ${req.params._id} not found` })
    }

    const updateComment ={
      user: body.user,
      comment_text: body.comment_text,
      comment_time: Date(),
      likes: body.likes
    }

    const updateResponse = await Comment.findByIdAndUpdate(req.params._id,updateComment,{ new: true })
    return res.status(200).json(updateResponse)
  } catch (error) {
    next(error)
  }
})

commentRouter.delete('/:_id', async(req,res,next) => {
  try{
    await Comment.findByIdAndDelete(req.params._id)
    return res.status(204).end()
  }catch(error){
    next(error)
  }
})

module.exports = commentRouter