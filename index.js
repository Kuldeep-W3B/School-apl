const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/school');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/api', schoolRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
