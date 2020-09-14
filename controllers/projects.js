const projectRouter = require('express').Router()
const Project = require('../models/project')

projectRouter.get('/', async (req, res,next) => {
  try{
    const project = await Project.find().populate('comments')
    return res.status(200).json(project)
  }catch(error){
    next(error)
  }
})

projectRouter.post('/', async (req, res,next) => {
  const body = req.body
  try {
    const project = new Project({
      project_name: body.project_name,
      slides: body.slides,
      likes: body.likes,
      comments: body.comments
    })

    const savedProject = await project.save()
    res.status(201).json(savedProject)
  } catch (error) {
    next(error)
  }
})

projectRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const project = await Project.findById(req.params._id)
    if(project === null){
      return res.status(404).json({ message: `project with id ${req.params._id} not found` })
    }
    project.project_name = body.project_name
    project.slides = body.slides
    project.likes = body.likes
    project.comments = body.comments

    const saveProject = await project.save()
    return res.status(200).json(saveProject)
  }catch(error){
    next(error)
  }
})

projectRouter.put('/:_id', async(req,res,next) => {
  const body = req.body
  try{
    const exsistingProject = await Project.findById(req.params._id)
    if(exsistingProject === null){
      return res.status(404).json({ message: `Project with id ${req.params._id} not found` })
    }

    const updateProject ={
      project_name: body.project_name,
      slides: body.slides,
      likes: body.likes,
      comments: body.comments
    }

    const updateResponse = await Project.findByIdAndUpdate(req.params._id,updateProject,{ new: true })
    return res.status(200).json(updateResponse)
  } catch (error) {
    next(error)
  }
})

projectRouter.delete('/:_id', async(req,res,next) => {
  try{
    await Project.findByIdAndDelete(req.params._id)
    return res.status(204).end()
  }catch(error){
    next(error)
  }
})


module.exports = projectRouter