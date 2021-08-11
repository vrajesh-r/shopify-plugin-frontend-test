let React = require("react");

module.exports = function RadioInput(props) {
	var className = props.className ? props.className : "";
	return (
		<div className={className}>
			{props.options.map(function (option) {
				return (
					<span key={option.id}>
						<input
							type="radio"
							id={option.id}
							name={option.name}
							value={option.value}
							checked={option.checked}
							disabled={option.disabled}
							onChange={props.onChange}
						/>
						<label
							htmlFor={option.id}
							className="form-group-portal emphasis margin-left"
						>
							{option.label}
						</label>
						&nbsp;&nbsp;
					</span>
				);
			})}
		</div>
	);
};
