require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
const Person = require('./models/person')

const morgan = require('morgan')
morgan.token('postData', (request) => {
  return JSON.stringify(request.body)
})



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]


// app.get('/', (request, response)=>{

//     response.send('<h2>Phone Book API</h2>')
// })

app.get('/api/persons', (request, response) => {
  // response.json(persons)
  Person.find({}).then(persons => {
    response.json(persons)
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
    .catch(error => {
      return next(error)
      // console.log(error)
      // response.status(400).send({error:"malformatted id"})


    })





  // console.log(typeof id)
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = { number:body.number }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new:true,
      runValidators:true,
      context:'query'

    })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})
app.get('/api/info', (request, response, next) => {
  // const size = Person.length
  console.log(Person)
  const currentDate = new Date()
  Person.find({})
    .then((persons) =>
      response.send(`<div> 
         <p> Phonebook has info for ${persons.length} people</p>
         <br />
         <p> ${currentDate}</p>
         
    
    
    </div>`))
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const { name, number } = request.body
  // const body = request.body
  // const name = body.name
  // const number = body.number
  // console.log("body", body)
  if(name || number){
    Person.findOne({ name: name }).then(existingPerson => {
      if (existingPerson) {
        // Update the existing person's number
        // console.log("person exist ooh")
        // console.log(existingPerson)
        existingPerson.number = number
        return existingPerson.save().then(updatedPerson => {
          response.json(updatedPerson)
        }).catch(error => {
          //  console.log("biko", error)
          next(error)
        }
        )
      } else {
        // console.log("Person does not exists")
        // Create a new person if they don't exist
        const newPerson = new Person({ name, number })
        return newPerson.save().then(savedPerson => {
          response.json(savedPerson)
        }).catch(error => next(error))
      }
    }).catch(error => next(error))

  }

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error:'malformatted id' })
  }else if(error.name === 'ValidationError'){
    // console.log("1", error.message)
    return response.status(400).json({ error:error.message })
  }

  next(error)
}


app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


