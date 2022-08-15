import { AbstractControl} from "@angular/forms";

export class Utils{
    constructor(){

    }

    /**
     * Get error message from control validation
     * @param control
     * @returns string validation error message
     */
    public getErrorMessage( control: any ) : string{
        if ( control.hasError('required') ) {
          return 'Este campo es requerido';
        }

        if ( control.hasError('minlength') ) {
          const minl = control.errors.minlength.requiredLength;
          return `Aumenta la longitud del texto a ${minl} caracteres`;
        }

        if ( control.hasError('maxlength') ) {
          const maxl = control.errors.maxlength.requiredLength;
          return `Este campo no puede exceder los ${maxl} caracteres`;
        }

        if ( control.hasError('min') ) {
          const min = control.errors.min.min;
          return `Aumenta el valor a ${min}`;
        }

        if ( control.hasError('max') ) {
          const max = control.errors.max.max;
          return `Este campo no puede ser mayor a ${max}`;
        }

        if( control.hasError('email') ){
          return 'Ingresa un e-mail válido';
        }

        if( control.hasError('equalsFieldsValidator') ){
          return 'Los campos no conciden';
        }

        return '';
    }

    /**
     * Validation for compare two equals control values
     * @param compare control for comparison
     * @returns
     */
     equalsFieldsValidator( compare : string ) {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const valueCompare = control.parent ? control.parent?.value?.[compare] : '';
        if( control.value !== null &&  control.value !== valueCompare )
          return { 'equalsFieldsValidator': true }

        return null;

      }
    }
}
