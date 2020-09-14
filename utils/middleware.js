// Example of a middleware function that handles some common error messages.

const errorHandler = (error, request, response, next) => {
  console.log('Exception caught by error handler:', error, error.message, error.name)

  if (     error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).send({ error: 'Duplicate key error' })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: `Likely the request is malformatted: ${error.message}` })
  } else if (error.name === 'TypeError') {
    return response.status(400).send({ error: `Check if the request is malformed: ${error.message}` })
  }
  next(error)
}

module.exports = {
  errorHandler
}