import { Component, OnInit } from "@angular/core";
//import { FormGroup, FormControl } from "@angular/forms";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { forbiddenNameValidator } from "./shared/user-name.validator";
import { passwordValidator } from "./shared/password.validator";
import { RegistrationService } from './registration.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  // registrationForm = new FormGroup({
  //   userName: new FormControl("Michael"),
  //   password: new FormControl(""),
  //   confirmPassword: new FormControl(""),
  //   address: new FormGroup({
  //     street: new FormControl(""),
  //     city: new FormControl(""),
  //     state: new FormControl(""),
  //     postalCode: new FormControl("")
  //   })
  // });

  get userName() {
    return this.registrationForm.get("userName");
  }

  get password() {
    return this.registrationForm.get("password");
  }

  get confirmPassword() {
    return this.registrationForm.get("confirmPassword");
  }

  get address() {
    return this.registrationForm.get("address");
  }

  get email() {
    return this.registrationForm.get("email");
  }

  get alternateEmails() {
    return this.registrationForm.get("alternateEmails") as FormArray;
  }

  addAlternateEmails() {
    this.alternateEmails.push(this.fb.control(""));
    console.log("addAlternateEmails pushed...");
  }

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private _registrationService: RegistrationService) {}

  ngOnInit() {
    // Alternative, use FormGroup to create registrationForm
    this.registrationForm = this.fb.group(
      {
        userName: [
          "Michael",
          [
            Validators.required,
            Validators.minLength(3),
            forbiddenNameValidator(/password/),
            forbiddenNameValidator(/admin/),
            forbiddenNameValidator(/root/)
          ]
        ],
        password: [""],
        confirmPassword: [""],
        email: [""],
        subscribe: [false],
        address: this.fb.group({
          street: [""],
          city: [""],
          state: [""],
          postalCode: [""]
        }),
        alternateEmails: this.fb.array([])
      },
      { validator: passwordValidator }
    );

    this.registrationForm
      .get("subscribe")
      .valueChanges.subscribe(checkedValue => {
        const email = this.registrationForm.get("email");
        if (checkedValue) {
          email.setValidators(Validators.required);
        } else {
          email.clearValidators();
        }
        email.updateValueAndValidity();
      });
  }

  loadApiData() {
    // this.registrationForm.patchValue({});
    // can be used for setting partial value of the object
    // this.registrationForm.setValue({}); set full values
    this.registrationForm.patchValue({
      userName: "Bruce",
      password: "test",
      confirmPassword: "test",
      email: "bruce@test.com",
      subscribe: true,
      address: {
        street: "123 Main Street",
        city: "Nashville",
        state: "TN",
        postalCode: "33001"
      }
    });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
    .subscribe(
      response => console.log("Success!", response),
      error => console.log("Error!", error)
    );
  }
}
