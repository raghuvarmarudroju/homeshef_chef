import { FormGroup, FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): {[key: string]: boolean} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;   
    if (control.value && !emailRegexp.test(control.value)) { 
        return {invalidEmail: true};
    }
    return { };
}
export function pincodeValidator(control: FormControl): {[key: string]: boolean} {
    var pincodeRegexp = /[0-9]{6}$/;   
    if (control.value && !pincodeRegexp.test(control.value)) { 
        return {invalidPincode: true};
    }
    return { };
}
export function phoneValidator(control: FormControl): {[key: string]: boolean} {
    var phoneRegexp = /[0-9]{10}$/;   
    if (control.value && !phoneRegexp.test(control.value)) { 
        return {invalidPhone: true};
    }
    return { };
}
export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }
}

export function maxWordsValidator(maxWordsCount: number) {
	return function maxWordsValidator(control: FormControl): { [key: string]: boolean } {
		if(control.value){
			let nameSplit = control.value.trim().split(' ');
			if (nameSplit.length > maxWordsCount) {
				return {
					maxNumberOfWordsExceeded: true
				}
			}
		}
		return { };
	}
}