const express = require('express')
const app = express()
const cors = require('cors')



app.use(express.json())
app.use(cors())

// morgan helps to log data to console
const morgan = require('morgan')
morgan.token('postData', (request)=>{
    return JSON.stringify(request.body)
})



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/', (request, response)=>{

    response.send('<h2>Phone Book API</h2>')
})

app.get('/api/persons', (request, response)=>{
    response.json(persons)

})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)

    const person = persons.find(person => person.id === id)
    if(person){

        response.send(person)
    }else{
        response.status(400).json({
            error: "Id not available"
        }).end()
        // response.status(400).end()
    }


    


    // console.log(typeof id)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=> person.id !== id)

    response.status(204).end()

})
app.get('/api/info', (request, response)=>{
    const size = persons.length
    const currentDate = new Date()
    response.send(`<div> 
         <p> Phonebook has info for ${size} people</p>
         <br />
         <p> ${currentDate}</p>
         
    
    
    </div>`)
})
const generateId = ()=>{
    const idLength = 8
    let randomId = '';

    for (let i=0; i < idLength; i++){
        const randomNumber = Math.floor(Math.random() * 10)
        randomId += randomNumber
    }
    return randomId
}
app.post('/api/persons', (request, response)=>{
    const body = request.body
    const name = body.name
    const number = body.number
    // console.log("body", body)

    if(name || number){
        const isNameAdded = persons.find(person=>person.name === name)
        if(isNameAdded){
            return response.status(400).json({
                error:"name must be unique"
            })
        }else{
            const id = Number(generateId())
            // console.log(typeof id)
            const person = {
                id: id,
                name:body.name,
                number: body.number
            }

            persons = persons.concat(person)
            return response.json(person)


        }
        

    }else{

         return response.status(400).json({
                error:"Name or Number missing"
             }).end()

    }
    
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id:id
    // }

    // console.log(body)
    // console.log(typeof id)


})



const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})


