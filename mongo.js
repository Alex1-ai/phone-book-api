const mongoose= require('mongoose')

mongoose.set('strictQuery', false)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})


const Person = mongoose.model('person',personSchema)



if(process.argv.length<3){
  console.log('give password as argument')
  process.exit(1)
}else if(process.argv.length===3){
  const password = process.argv[2]
  const url =
    `mongodb+srv://fullstack:${password}@cluster0.gbwjvbq.mongodb.net/?retryWrites=true&w=majority`

  mongoose.connect(url)
  // const password = process.argv[2]

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(` ${person.name} ${person.number}`)
    })

    mongoose.connection.close()
  })


}else if(process.argv.length===5){
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]
  const url =
    `mongodb+srv://fullstack:${password}@cluster0.gbwjvbq.mongodb.net/?retryWrites=true&w=majority`

  mongoose.connect(url)
  // mongoose.connect(url)
  // ADDING NEW PHONEBOOK TO THE PHONEBOOK DATABASE
  const person = new Person({
    name:name,
    number: number
  })


  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })



}













