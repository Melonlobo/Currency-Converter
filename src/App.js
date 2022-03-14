import { useState, useEffect } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

let nations;

function App() {
	const [date, setDate] = useState('00-00-0000');
	const [currencyOptions, setCurrencyOptions] = useState([]);
	const [fromCurrency, setFromCurrency] = useState();
	const [toCurrency, setToCurrency] = useState();
	const [amount, setAmount] = useState(1);
	const [exchangeRateA, setExchangeRateA] = useState();
	const [exchangeRateB, setExchangeRateB] = useState();
	const [amountIsFromCurrency, setAmountIsFromCurrency] = useState(true);
	const [nationA, setNationA] = useState();
	const [nationB, setNationB] = useState();

	let fromAmount, toAmount;
	if (amountIsFromCurrency) {
		fromAmount = amount;
		toAmount = (amount * exchangeRateB) / exchangeRateA;
	} else {
		toAmount = amount;
		fromAmount = (amount * exchangeRateA) / exchangeRateB;
	}

	useEffect(() => {
		fetch('http://localhost:5000/exchangerates')
			.then((res) => res.json())
			.then((data) => {
				const date = data.date.split('-');
				setDate(`${date[2]}-${date[1]}-${date[0]}`);
				setCurrencyOptions([...Object.keys(data.rates)]);
				setFromCurrency(data.base);
				setToCurrency(Object.keys(data.rates)[66]);
			})
			.catch((err) => console.error(err.message));
		fetch('http://localhost:5000/symbols')
			.then((res) => res.json())
			.then((data) => {
				nations = data.symbols;
			})
			.catch((err) => console.error(err.message));
	}, []);

	function handleFromAmountChange(e) {
		setAmount(e.target.value);
		setAmountIsFromCurrency(true);
	}
	function handleToAmountChange(e) {
		setAmount(e.target.value);
		setAmountIsFromCurrency(false);
	}

	useEffect(() => {
		if (fromCurrency && toCurrency) {
			fetch(
				`http://localhost:5000/exchangerates?symbols=${fromCurrency},${toCurrency}`
			)
				.then((res) => res.json())
				.then((data) => {
					setExchangeRateA(data.rates[fromCurrency]);
					setExchangeRateB(data.rates[toCurrency]);
					setNationA(nations[fromCurrency]);
					setNationB(nations[toCurrency]);
				});
		}
	}, [fromCurrency, toCurrency]);

	return (
		<>
			<h1>Currency Converter</h1>
			<h2 className='date'>{date}</h2>
			<CurrencyRow
				currencyOptions={currencyOptions}
				selectedCurrency={fromCurrency}
				onChangeCurrency={(e) => setFromCurrency(e.target.value)}
				onChangeAmount={handleFromAmountChange}
				amount={fromAmount}
				nation={nationA}
			/>
			<div className='equals'>=</div>
			<CurrencyRow
				currencyOptions={currencyOptions}
				selectedCurrency={toCurrency}
				onChangeCurrency={(e) => setToCurrency(e.target.value)}
				onChangeAmount={handleToAmountChange}
				amount={toAmount}
				nation={nationB}
			/>
		</>
	);
}

export default App;
