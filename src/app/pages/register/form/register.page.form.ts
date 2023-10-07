import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";

export class RegisterPageForm{
  private formBuilder: FormBuilder;
  private form: FormGroup

  constructor(formBuilder : FormBuilder){
    this.formBuilder = formBuilder;
    this.form = this.createForm();
  }

  private createForm(): FormGroup{
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: this.formBuilder.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        neighborhood: ['', [Validators.required]],
        complement: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]]
      })
    })

    this.form.get('repeatPassword').setValidators(matchPasswordAndRepeatPassword(this.form))
    return this.form;
  }

  getForm(): FormGroup {
    return this.form;
  }
}

function matchPasswordAndRepeatPassword(form: FormGroup): ValidatorFn{
  const password = form.get('password');
  const repeatPassword = form.get('repeatPassword');

  const validator = () => {
    return password.value == repeatPassword.value? null: {isMatching: true}
  };

  return validator;
}
