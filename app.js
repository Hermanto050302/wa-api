const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const router = require('./routers/wa');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use("/", router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});