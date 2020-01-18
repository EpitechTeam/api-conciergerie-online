const express = require('express')
const userRouter = require('./src/routers/user')
const freelanceRouter = require('./src/routers/freelance')
const missionRouter = require('./src/routers/mission')
const ownerRouter = require('./src/routers/owner')
const stripeRouter = require('./src/routers/stripe')
const fileUpload = require('express-fileupload');
require('dotenv').config();
require('./src/db/db');
const compression = require('compression')
const bodyParser = require("body-parser")
const morgan = require("morgan")
const app = express();

app.use(
	bodyParser.json({
		// We need the raw body to verify webhook signatures.
		// Let's compute it only when hitting the Stripe webhook endpoint.
		verify: function(req, res, buf) {
			if (req.originalUrl.startsWith("/webhook")) {
				req.rawBody = buf.toString();
			}
		}
	})
);
app.use(express.json())
app.use(compression())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(morgan("tiny"))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization')
	next()
})

app.use("/", userRouter)
app.use("/", freelanceRouter)
app.use("/", missionRouter)
app.use("/", ownerRouter)
app.use("/", stripeRouter)

// default options
app.use(fileUpload());
app.post('/upload', function(req, res) {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let file = req.files[Object.keys(req.files)[0]];
	// Use the mv() method to place the file somewhere on your server
	file.mv(process.env.UPLOAD_PATH+ "/" + file.name , function(err) {
		if (err)
			return res.status(500).send(err);
		res.status(200).send({ status: 'File uploaded!', url: process.env.UPLOAD_HOST + "/file/" + file.name });
	});
});
console.log(__dirname + "/" + process.env.UPLOAD_PATH);
app.use('/file', express.static(__dirname + "/" + process.env.UPLOAD_PATH + "/"));

app.get('/', (req, res) => {
	res.json("EIP API V1.0")
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

process.on('uncaughtException', err => {
	console.log(err)
})

