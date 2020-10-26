const mongoose =require('mongoose')
const password =process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster0.jqeop.mongodb.net/persons-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (name === 'undefined' || number === 'undefined') {
  Person
    .find({})
    .then(person => {
      console.log('Phonebook:')
      person.map(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
}
else
{
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`person ${name} ${number} saved to phonebook`)
    mongoose.connection.close()
  })
}