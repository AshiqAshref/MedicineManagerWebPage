import { AbstractControl, FormControl, FormControlOptions, ValidationErrors, Validators } from "@angular/forms";

export class CustomValidators extends Validators{

    static onlyNumbers(control:FormControl):ValidationErrors | null{
        if(isNaN(Number(control.value)))
            return {onlyNumbers: true}
        return null
    }


    static dropDownNotNull(control:AbstractControl):ValidationErrors | null{
        if(control.value==0)
            return {dropDownNotNull: true}
        return null
    }
}