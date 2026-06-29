require('dotenv').config();

const app = require('./src/app');

const port = process.env.PORT || 5100;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
