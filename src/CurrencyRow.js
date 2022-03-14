const CurrencyRow = (props) => {
	const {
		currencyOptions,
		selectedCurrency,
		onChangeCurrency,
		amount,
		onChangeAmount,
		nation,
	} = props;
	return (
		<div className='container'>
			<div className='currency-row'>
				<input
					type='number'
					min='0'
					className='input'
					value={amount}
					onChange={onChangeAmount}
				/>
				<select value={selectedCurrency} onChange={onChangeCurrency}>
					{currencyOptions.map((option) => {
						return (
							<option key={option} value={option}>
								{option}
							</option>
						);
					})}
				</select>
			</div>
			<section className='nation'>{nation}</section>
		</div>
	);
};

export default CurrencyRow;
