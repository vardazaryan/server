const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router');
const io = require('./socket');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/register', require('./auth'));

global.__homedir = __dirname;
app.use('/auth', require('./routes/auth'));
router(app);
mongoose.connect('mongodb+srv://sunny:test@cluster0.owpq5.mongodb.net/Test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    const server = http.createServer(app);
    server.listen(2021);
    io(server);
});

