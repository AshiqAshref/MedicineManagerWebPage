import { AbstractControl, FormControl, FormControlOptions, ValidationErrors, Validators } from "@angular/forms";

export class CustomValidators extends Validators{

    static onlyNumbers(control:FormControl):ValidationErrors | null{
        if(isNaN(Number(control.value)))
            return {onlyNumbers: true}
        return null
    }


    static dropDownNotNull(control:AbstractControl):ValidationErrors | null{
        if(control.value==0 || isNaN(control.value) || control.value==null)
            return {dropDownNotNull: true}
        return null
    }

    
    static ipValidator(control:FormControl):ValidationErrors | null{
        if(!CustomValidators.isValidIP(String(control.value)))
            return {ipValidator: true}
        return null
    }
    

    
    private static validPart(s:string) {
        const n = s.length;
        
        // If the length of the passed string is more than 3, it is not valid
        if (n > 3) {
            return false;
        }
        
        // Check if the string only contains digits, if not, return false
        for (let i = 0; i < n; i++) {
            if (!(s[i] >= '0' && s[i] <= '9')) {
                return false;
            }
        }
        
        // Convert the string to an integer
        const x = parseInt(s);
        
        // The string is valid if the number generated is between 0 to 255
        return (x >= 0 && x <= 255);
    }
    
    // Return true if the IP string is valid, else return false
    private static isValidIP(ipStr:string) {
        // If the string is empty, return false
        if (ipStr === null) {
            return false;
        }
        
        const parts = ipStr.split('.');
        let count = 0;
        
        // The number of dots in the original string should be 3 for it to be valid
        for (let i = 0; i < ipStr.length; i++) {
            if (ipStr[i] === '.') {
                count++;
            }
        }
        
        if (count !== 3) {
            return false;
        }
    
        for (let i = 0; i < parts.length; i++) {
            if (!this.validPart(parts[i])) {
                return false;
            }
        }
        
        return true;
    }

    

}