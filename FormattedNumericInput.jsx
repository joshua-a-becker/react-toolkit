import React from "react";

var countDecimals = function (value) {    		
	//source: https://stackoverflow.com/questions/17369098/simplest-way-of-getting-the-number-of-decimals-in-a-number-in-javascript
  return value.toString().split(".")[1]===undefined ? 0 : value.toString().split(".")[1].length || 0; 
}

function number_format(number, decimals, dec_point, thousands_sep) {  
  
	// modified from original to allow variable decimal length inputs, 
	// which requires preserving the decimal in "1." and "1.0"
	// this assumes a STRING input (so that 1.0 != 1)
	
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
	
	
export default class NumericTaskResponse extends React.Component {
		
	state={formValid: false, inputValue: ""}
  
	
	handleChange = event => {
	
	  // note cursor location in case of re-render due to formatting
		const cursorLocation = event.currentTarget.selectionStart;
		
		// get element because event is not persistent
	  const el = event.currentTarget;		
		
		// remove all commas and spaces from number for processing
		const formValue  = event.currentTarget.value.replace(/\s/g, '').replace(/,\s?/g, "");
		
		// set element state for form validity
    this.setState({formValid : !isNaN(formValue ) && formValue  != ""})		
		
		// either format the number and adjust the cursor
		// or return the string as-is
		// use Number() because isNaN() alone returns false positives
		if( !isNaN(Number(formValue )) && el.value != "" ) {
			//format number and, if necessary, advance cursor
			const newText = number_format(formValue )
			const cursorAdvance = newText.length - el.value.length;

			this.setState(
				{inputValue : newText},
				()=>{el.setSelectionRange(cursorLocation+cursorAdvance,cursorLocation+cursorAdvance)}
			)
		} else {
			console.log("not valid?");
			console.log(Number(formValue ));		
			console.log(!isNaN(Number(formValue )));		
			console.log(el.value != "");
			console.log(!isNaN(Number(formValue )) && el.value != "");
			this.setState({inputValue : formValue })
		} 
		
		// add commas back in for display, only if its a valid number		
				
  };

  render() {
    const formValue  = this.state.inputValue.replace(/\s/g, '').replace(/,\s?/g, "");
		const isValid = !isNaN(formValue );
    return (
      <div className="pt-form-content">
				<strong>Your Answer:&nbsp;</strong>
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