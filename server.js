const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const server = express();

dotenv.config({ path: 'config.env' });
const port = process.env.PORT || 8080;

server.use(cors());

server.use(express.static(path.resolve(__dirname, 'build')));

server.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

server.get('/exchangerates', (req, res) => {
	if (Object.keys(req.query).length > 0) {
		const symbols = req.query.symbols.split(',');
		const fromCurrency = symbols[0];
		const toCurrency = symbols[1];
		fetch(
			`http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.ACCESS_KEY}&symbols=${fromCurrency},${toCurrency}`
		)
			.then((data) => data.json())
			.then((json) => res.send(json))
			.catch((err) => console.error(err.message));
	} else {
		fetch(
			`http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.ACCESS_KEY}`
		)
			.then((data) => data.json())
			.then((json) => res.send(json))
			.catch((err) => console.error(err.message));
	}
});

server.get('/symbols', (req, res) => {
	fetch(
		`http://api.exchangeratesapi.io/v1/symbols?access_key=${process.env.ACCESS_KEY}`
	)
		.then((data) => data.json())
		.then((json) => res.send(json))
		.catch((err) => console.error(err.message));
});

server.listen(port, () =>
	console.log(`Server running at http://localhost:${port}`)
);
