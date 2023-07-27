
// Mongoose setup
const mongoose= require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
// console.log('connecting to', url)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required:true

  },
  number: {
    type:String,
    required: true,
    minLength:8,
    validate: {
      validator: function(value){
        //  // Check if the phone number matches the pattern "XX-XXXXXXXX" or "XXX-XXXXXXXX"
        const pattern =  /^[0-9]{2,3}-[0-9]+$/
        return pattern.test(value)
      },
      message: props => `${props.value} is not a valid phone number  XX-XXXXXXXX" or "XXX-XXXXXXXX`
    }
  },
})
personSchema.set('toJSON',{
  transform: (document, returnedObject) =>
  {returnedObject.id= returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v}
})
module.exports = mongoose.model('person',personSchema)