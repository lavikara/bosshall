import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Injectable()
export class ValidatorHelper {
    constructor() {

    }

    public isValid(inputObject: any, inputProperty: string): boolean {
        // tslint:disable-next-line:triple-equals
        return (inputObject.controls[inputProperty].valid == true || inputObject.controls[inputProperty].pristine == true);
    }

    public canSubmit(inputObject: any): boolean {
        return inputObject.valid;
    }


    public checkSameValidator(value: AbstractControl, value2: AbstractControl): ValidationErrors | null {
        if (value.value === value2.value) {
            return null;
        }
        return {checkSame: true};
    }

    public endDateLowerThanStart(value: AbstractControl, value2: AbstractControl): ValidationErrors | null {
        if (new Date(value.value) < new Date(value2.value)) {
            return null;
        }
        return {endLowerThanStart: true};
    }

    public startDateLowerThanToday(value: AbstractControl): ValidationErrors | null {
        if (new Date(value.value) > new Date()) {
            return null;
        }
        return {DateLowerThanToday: true};

    }
}
