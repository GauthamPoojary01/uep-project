// ✅ Fix for index.js (backend) - Correct import path and route usage
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const schoolRouter = require('./routes/schoolRouter'); 
const form2Router = require('./routes/form2Router'); 
const form3Router = require('./routes/form3Router'); 
const form4Router = require('./routes/form4Router');
const form5Router = require('./routes/form5Router'); 
const form6Router = require('./routes/form6Router'); 
const form7Router = require('./routes/form7Router'); 
const form8Router = require('./routes/form8Router'); 
const form9Router = require('./routes/form9Router'); 
const form10Router = require('./routes/form10Router'); 
const form11Router = require('./routes/form11Router'); 
const form12Router = require('./routes/form12Router');
const form13Router = require('./routes/form13Router'); 
const form14Router = require('./routes/form14Router') ;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRouter); 
app.use('/api/forms/form2', form2Router);
app.use('/api/forms/form3', form3Router);
app.use('/api/forms/form4', form4Router);
app.use('/api/forms/form5', form5Router);
app.use('/api/forms/form6', form6Router);
app.use('/api/forms/form7', form7Router);
app.use('/api/forms/form8', form8Router);
app.use('/api/forms/form9', form9Router);
app.use('/api/forms/form10', form10Router);
app.use('/api/forms/form11', form11Router);
app.use('/api/forms/form12', form12Router);
app.use('/api/forms/form13', form13Router);
app.use('/api/forms/form14', form14Router); // ✅ fix: use correct variable

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});