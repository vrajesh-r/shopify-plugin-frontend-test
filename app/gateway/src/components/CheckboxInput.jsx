var React = require("react");

module.exports = function CheckboxInput(props) {
	var className = props.className ? props.className : "";
	return (
		<div className={className}>
			<input
				type="checkbox"
				id={props.id}
				name={props.name}
				checked={props.checked}
				disabled={props.disabled}
				onChange={props.onChange}
			/>
			<label htmlFor={props.id} className="form-group-portal emphasis margin-left">
				{props.label}
			</label>
		</div>
	);
};
