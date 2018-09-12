import React from "react";
import SocialExposure from "./SocialExposure.jsx";

var countDecimals = function (value) {    		
    return value.toString().split(".")[1]===undefined ? 0 : value.toString().split(".")[1].length || 0; 
}

function number_format(number, decimals, dec_point, thousands_sep) {  
  decimals = decimals || countDecimals(number);
	const addDecimal = number.includes(".") && decimals==0;
	// source: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	var n = !isFinite(+number) ? 0 : +number, 
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			toFixedFix = function (n, prec) {
					// Fix for IE parseFloat(0.55).toFixed(0) = 0;
					var k = Math.pow(10, prec);
					return Math.round(n * k) / k;
			},
			s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
	if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	var returnString = s.join(dec);
	return addDecimal ? returnString+"." : returnString;
}
	
	
export default class FormattedNumericInput extends React.Component {
		
	state={formValid: false, inputValue: ""}
  
	
	handleChange = event => {
	
		const cursorLocation = event.currentTarget.selectionStart;
		console.log(cursorLocation)
	  const el = event.currentTarget;
		// remove all commas and spaces from number for processing
		const formValue  = event.currentTarget.value.replace(/\s/g, '').replace(/,\s?/g, "");
		
    this.setState({formValid : !isNaN(formValue ) && formValue  != ""})
		this.props.player.stage.set("formValue ", !isNaN(formValue ) ? formValue  : "")
		
		
		if(!isNaN(el.value) && el.value != "") {
			//format number and, the length has changed, advance cursor
			const newText = number_format(formValue )
			const cursorAdvance = newText.length - el.value.length;
			
			// if a valid number, set formatted value and cursor location
			this.setState(
				{inputValue : newText},
				()=>{el.setSelectionRange(cursorLocation+cursorAdvance,cursorLocation+cursorAdvance)}
			)
		} else {
			// if not a valid number, set as input
			this.setState({inputValue : formValue })
		} 
		
		// add commas back in for display, only if its a valid number		
		
		console.log(el.selectionStart);
  };

  
  render() {
		
    const formValue = this.state.inputValue.replace(/\s/g, '').replace(/,\s?/g, "");
		const isValid = !isNaN(formValue );
    return (
				<input 
							type="text" 
							name="username" 
							placeholder="Enter your answer"
							value={this.state.inputValue}
							onChange={this.handleChange}
						/>
						{isValid ? "" : <br/>}
						{isValid ? "" : <span className="validateInput">You must enter a number</span>}
      </div>
    );
	}
}
