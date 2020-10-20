require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } else {
        return null
    }
})

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :data'))

let persons =[
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
       
      },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
       
      },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
        
      },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
        
      }
]

app.get('/info', (req, res) => {
    const info = `There is information of ${persons.length} people in the phonebook.`
    const date = Date()

    res.send(`<p>${info}</p> <p>${date}</P>`)
})

app.get('/api/persons/', (req, res) => {
    Person.find({}).then(persons => {        
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }

    /*const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)*/
    })
    .catch(error => next(error))
    
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})



app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name is missing!'
        })
    }
    if (body.number === undefined) {
        return res.status(400).json({
            error: 'number is missing!'
        })
    }

    /*if (!persons.every(p => p.name !== body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }*/

    const person = new Person ({
        id: Math.floor(Math.random() * 100),
        name: body.name,
        number: body.number
       
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id'})
    }
    next(error)
}
app.use(errorHandler)

  const PORT = process.env.PORT 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
