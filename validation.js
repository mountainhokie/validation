/*
 * Sabre Basic Form Validation
 * No Framework Needed, Vanilla JS
 */
let sabreValidate = (function () {
	'use strict';

	// Variables //

	let pubMeth = {};
	let formErr = false;
	let maxAttempt = 3;
	let formInputPar,
		errorMess;

	// Validation Rules
	const validations = {
	  required: function(value){
	    return value !== '';
	  },
	  email: function(value){
	    return value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	  },
	  alphanumeric: function(value){
	    return value.match(/^[a-z0-9]+$/i);
	  },
	  numeric: function(value){
	    return value.match(/^[a-z]+$/i);
	  },
	  passmatch: function(value1, value2) {
		if(value1 != value2)
		  	return false;
		else
		  	return true;
	  },
	}

	// Validation Messages
	const validationMessages = {
	  alphanumeric: 'Username may only be alphanumeric.',
	  maxattempts: 'You have exceeded the maximum (3) number of attempts.',
	  passmatch: 'Passwords do not match.  Please ensure passwords entered match.',
	  email: 'Please enter a valid email address.',
	};

	// Methods //

	/** Private Methods **/

	// Validates form element
	let validVal = function (form, formInput) {
		let attr = formInput.getAttribute('data-validation'),
		  rules = attr ? attr.split(' ') : '',
		  j = 0;
		console.log(formInput);
		//let customVal = formInput.getAttribute('data-regex');
  	while (j < rules.length) {
  		if(rules[j]=='passmatch'){
  			let passMels = document.getElementsByClassName('passmatch');
				let firstInput = passMels[0];
				let secondInput = passMels[1];
  			formInputPar = secondInput.parentNode;
  			let errorMessage = errMessCheck(formInputPar);

  			for (let i = 0; i < passMels.length; i++) {
    			if(!validations[ rules[j] ]( firstInput.value, secondInput.value )) {
    				firstInput.classList.remove('success');
						firstInput.classList.add('error');
						formInputPar.classList.add('error');
						formInputPar.classList.remove('sucess');
						secondInput.classList.remove('success');
						secondInput.classList.add('error');
						if(errorMessage)
							errorMessage.innerHTML = '<p>'+validationMessages[rules[j]]+'</p>';
						return false;
					} else {
						firstInput.classList.remove('error');
						firstInput.classList.add('success');
						console.log('success1')
						formInputPar.classList.remove('error');
						formInputPar.classList.add('success');
						secondInput.classList.remove('error');
						secondInput.classList.add('success');
						console.log('success2')
						secondInput.parentNode.classList.remove('error');
						secondInput.parentNode.classList.add('success');
						console.log('success3')
						if(errorMessage){
							errorMessage.remove();
						}
						formErr = false;
					}
				}      			
  		} else if(!validations[rules[j]](formInput.value)) {
  			console.log(formInput);
				formInputPar = formInput.parentNode;
  			let errorMessage = errMessCheck(formInputPar);
      	let labelName = formInput.name;
	    	let valMes = '';
    		if (validationMessages[rules[j]])
					valMes = validationMessages[rules[j]];
          
        if(errorMessage){
        		errorMessage.classList.add('error');

        	if(formInput.previousElementSibling.tagName.toLowerCase()=='label'){
          		labelName = formInput.previousElementSibling.textContent.replace('*','').replace(':','').trim();
         	}
        	  	if(rules[j]=='required'){
      	            errorMessage.innerHTML = "<p>Field is required. Please enter " + labelName + ".</p>";
  	          	}else
            	errorMessage.innerHTML = "<p>Invalid input.  '" + rules[j] + "' for input '" + labelName + "' "+  valMes;
        }			    
				formInput.classList.remove('success');
				formInput.classList.add('error');
				formInputPar.classList.add('error');
				formInputPar.classList.remove('success');
				return false;
			} else {			
				formInput.classList.remove('error');
				formInput.classList.add('success');
				console.log('success4')
				formInput.parentNode.classList.remove('error');
				formInput.parentNode.classList.add('success');
				//formInputPar.classList.add('success');
				//formInputPar.classList.remove('error');
				if(formInput.nextElementSibling){
					formInput.nextElementSibling.remove();
				}
				formErr = false;
			}
      j++;
    }
    return true;
	}

	// Checks/Creates Error Message for each input
	let errMessCheck = function () {
		if(formInputPar.getElementsByClassName('error-message').length>0){
			errorMess = formInputPar.getElementsByClassName('error-message')[0];      			
		} else {
    		errorMess = document.createElement('div');
    		errorMess.className = 'error-message';
			formInputPar.appendChild(errorMess)
		}
		return errorMess;
	};

	/** Public Methods **/
	// Init
	pubMeth.init = function (options) {
		const forms = document.getElementsByClassName("validate-form");

  	for (let i = 0; i < forms.length; i++) {
    	let form = forms[i];
			let inputsArr = form.querySelectorAll('.form-field');
			const successMessage = document.querySelector(".message");

			Array.prototype.forEach.call(inputsArr, function(fInput){
				// Validate upon blur
  		    	fInput.addEventListener('blur', function (event) {
			    	let valResponse = validVal(form, fInput);
				});
				// Clears input on focus (if need be)
				fInput.addEventListener('focus', function () {
					if(fInput.nextElementSibling){
						if(!formErr)
							fInput.nextElementSibling.remove();
					}
			    	fInput.classList.remove('error');  
				});
			});

			// Validate upon submission
  		form.addEventListener('submit', function(e){
  			e.preventDefault();
  			formErr = false;
		    let i = 0;
		    while (i < inputsArr.length) {
		      let valResponse = validVal(form, inputsArr[i]);
		      if(valResponse==false){
		      	formErr = true;
		      	inputsArr[i].focus();
		      	inputsArr[i].classList.add('error'); 
		      	inputsArr[i].parentNode.classList.add('error');
		      	break;
		      }				    
		      i++;
		    }			    

        maxAttempt --;
				if(document.getElementById('maxAttempts')){
					let maxMessage = document.querySelector(".message");
				 	document.getElementById('maxAttempts').value = maxAttempt;
				  	if(maxMessage)
				     	maxMessage.innerHTML = '<p>You may only have 3 attempts before becoming locked out. You have '+ maxAttempt +' attempts left.</p>'
					if(maxAttempt==0){
						form.querySelector('.loginbutton').disabled = true;
						form.querySelector('.loginbutton').style.display = 'none';
					    maxMessage.innerHTML = '<p>'+validationMessages['maxattempts']+'</p>';
					}
				}

				if(!formErr){
					if(successMessage){
					    successMessage.className = "ui success message";
					    successMessage.innerHTML = "Form is submitting...";
					}
					form.submit();
				}			    
			}, false)
		}
	};

	// Repcaptcha
	pubMeth.recaptchaValidate = function (options) {
		document.getElementById('submit').disabled = false;
	};

	// Return the Public Methods //
	return pubMeth;

})();

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sabreValidate.init());
} else {
    sabreValidate.init();
}
function recaptcha_callback() {
	sabreValidate.recaptchaValidate();
}
