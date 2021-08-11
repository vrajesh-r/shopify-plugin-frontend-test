var React = require("react");

module.exports = function TextInput(props) {
	var className = props.className ? " " + props.className : "";
	var type = props.type ? props.type : "text";
	return (
		<div className={"form-group-portal portal-text" + className}>
			<label htmlFor={props.id} className="emphasis">
				{props.title}
			</label>
			{props.hint}
			<input
				className="form-portal-element"
				type={type}
				id={props.id}
				name={props.name}
				value={props.value}
				disabled={props.disabled}
				onChange={props.onChange}
			/>
		</div>
	);
};
