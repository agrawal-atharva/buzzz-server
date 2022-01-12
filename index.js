//dependencies
const express = require('express');
const cookieSession = require('cookie-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./controller/Users/passportSetup');

const port = process.env.PORT || 5000;
const { MONGO_URL } = require('./keys/keys');

const authRoute = require('./routes/Auth/authRoute');
const dummyUsers = require('./routes/Users/dummyUsers');
const users = require('./routes/Users/users');
const postRoute = require('./routes/Posts/posts');

const app = express();

//content-length
app.use(express.json({ limit: '50mb' }));

//cors
corsOptions = {
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	optionsSuccessStatus: 200,
	exposedHeaders: ['Access-Control-Allow-Origin'],
	credentials: true,
};
app.use(cors(corsOptions));

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cookie-session
app.use(
	cookieSession({
		name: 'session',
		keys: ['atharva'],
		maxAge: 24 * 60 * 60 * 60,
	})
);

//passport
app.use(passport.initialize());
app.use(passport.session());

/*routes*/

//create dummy user
app.use('/dummy/user', dummyUsers);

//signup a user
app.use('/auth', authRoute);

//user route
app.use('/user', users);

//posts route
app.use('/post', postRoute);

//mongoose connect
mongoose.connect(MONGO_URL, {
	useNewUrlParser: 'true',
});
mongoose.connection.on('error', (err) => {
	console.log('err', err);
});
mongoose.connection.on('connected', (err, res) => {
	console.log('mongoose is connected');
});

//listening to server
app.listen(port, () => {
	console.log(`Server listening on port ${port}!`);
});
