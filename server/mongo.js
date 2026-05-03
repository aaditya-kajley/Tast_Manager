const mongoose = require('mongoose');

mongoose.connect(process.env.mongo)
.then(async () => {
  console.log("Connected")
  const admin = await Users.findOne({role : "admin"})
    if(!admin){
      const newAdmin = new Users({name: "Aaditya",email: "aaditya@gmail.com",password: "asdf",role: "admin"})
      await newAdmin.save()
      console.log("admin created")
    }
})
.catch(() => {console.log("Not Connected")})


// ─── Schemas ───────────────────────────────────────────────────────────────

const usersSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, required: true },
},{timestamps:true})

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  startDate:   { type: Date },
  deadline:    { type: Date },
  assignments: [
    {
      employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
      tasks:    [{ type: String }]
    }
  ]
},{timestamps:true});

// ─── Models ────────────────────────────────────────────────────────────────

const Users    = mongoose.model('Users', usersSchema);
const Projects  = mongoose.model('Project', projectSchema);
module.exports = { Users, Projects };