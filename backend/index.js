// ✅ Fix your backend/index.js path
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const schoolRouter = require('./routes/schoolRouter'); // 🔁 fix path here
const form1Routes = require('./routes/form1Routes');



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/users', userRoutes);
app.use('/api/schools', schoolRouter); // ✅ this now points to schoolRouter.js
app.use('/api/forms/form1', form1Routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});