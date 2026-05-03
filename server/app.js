const express  = require('express');
const cors     = require('cors');
require('dotenv').config();

const { Users, Projects } = require('./mongo');

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────

// app.use(helmet());                          // security headers
app.use(cors({ 
  origin: process.env.frontend,
  // credentials: true
 }));             // allow all origins — restrict in production
app.use(express.json());                    // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data
// app.use(morgan('dev'));                      // request logging

// ─── Admin API ─────────────────────────────────────────────────────────────

app.post('/signin',async (req,res) => {
  const {email,password} = req.body
  console.log(req.body)
  const user = await Users.findOne({email:email,password:password});
  if(!user){
    res.json({status:false})
  }
  else{
    res.json({status:true,role:user.role});
  }
})

// POST /api/admin — create admin
app.post('/admin', async (req, res) => {
  try {
    const { name, email, password, role } = req.body.form;
    const admin = new Users({ name, email, password, role });
    await admin.save();
    res.status(201).json({ status : true });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ status: false });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/admin/:email', async (req, res) => {
  try {
    const email = req.params.email
    const delUser = await Users.findOneAndDelete({email:email})
    if(!delUser){
      res.json({status:false})
    }
    else {
      res.json({status:true});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin — get all admins
app.get('/admin', async (req, res) => {
  try {
    const admins = await Users.find({role:"admin"}).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Employee API ──────────────────────────────────────────────────────────

// POST /api/employee — create employee
app.post('/employee', async (req, res) => {
  try {
    const { name, email, password, role } = req.body.form;
    const employee = new Users({ name, email, password,role });
    await employee.save();
    res.status(201).json({ status: true });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ status:false });
    res.status(500).json({ error: err.message });
  }
});

app.delete('/employee/:email', async (req, res) => {
  try {
    const email = req.params.email
    const delUser = await Users.findOneAndDelete({email:email})
    if(!delUser){
      res.json({status:false})
    }
    else {
      res.json({status:true});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employee — get all employees
app.get('/employee', async (req, res) => {
  try {
    const employees = await Users.find({role: "employee"}).select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Project API ───────────────────────────────────────────────────────────

// POST /api/project — create project
app.post('/api/project', async (req, res) => {
  try {
    const { title, description, status, startDate, deadline, assignments } = req.body;
    if (!title)
      return res.status(400).json({ error: 'title is required' });

    const project = new Projects({ title, description, status, startDate, deadline, assignments });
    await project.save();
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/project — get all projects with employee details populated
app.get('/api/project', async (req, res) => {
  try {
    const projects = await Projects.find().populate('assignments.employee', 'name email position');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health Check ──────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── 404 Handler ───────────────────────────────────────────────────────────

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Global Error Handler ──────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ─── Start ─────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => console.log(`Server running on ${PORT}`));