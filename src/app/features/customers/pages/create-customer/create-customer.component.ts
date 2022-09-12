import { map, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { CustomersService } from '../../services/customer/customers.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  profileForm!: FormGroup;
  createCustomerModel$!: Observable<Customer>;
  customer!: Customer;
  isShow: Boolean = false;
  isNationaltyId: Boolean = false;
  today: Date = new Date();
  isBirthDate: Boolean = false;
  maxDate: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomersService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createCustomerModel$ = this.customerService.customerToAddModel$;
  }

  ngOnInit(): void {
    this.createCustomerModel$.subscribe((state) => {
      this.customer = state;
      this.createFormAddCustomer();
    });
  }

  createFormAddCustomer() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      fatherName: [''],
      motherName: [''],
      nationalityId: [
        '',
        [Validators.pattern('^[0-9]{11}$'), Validators.required],
      ],
    });
  }

  getCustomers(id: number) {
    this.customerService.getList().subscribe((response) => {
      let matchCustomer = response.find((item) => {
        return item.nationalityId == id;
      });
      if (matchCustomer) {
        this.isNationaltyId = true;
      } else {
        this.isNationaltyId = false;
        this.customerService.setDemographicInfoToStore(this.profileForm.value);
        this.router.navigateByUrl('/dashboard/customers/list-address-info');
      }
    });
  }

  goNextPage() {
    if (this.profileForm.valid) {
      this.isNationaltyId = false;
      this.isShow = false;
      this.getCustomers(this.profileForm.value.nationalityId);
    } else {
      this.isNationaltyId = false;
      this.isShow = true;
    }
  }

  isNumber(event: any): boolean {
    console.log(event);
    const pattern = /[0-9]/;
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (pattern.test(char)) return true;

    event.preventDefault();
    return false;
  }

  onDateChange(event: any) {
    console.log(this.maxDate);
    this.isBirthDate = false;
    let date = new Date(event.target.value);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    if (date.getTime() > this.maxDate.getTime()) {
      this.profileForm.get('birthDate')?.setValue('');
      this.isBirthDate = true;
    } else {
      this.isBirthDate = false;
    }
  }

  // onDateChange(event: any) {
  //   this.isBirthDate = false;
  //   let date = new Date(event.target.value);
  //   if (
  //     date.getFullYear() > this.today.getFullYear() ||
  //     date.getMonth() > this.today.getMonth() ||
  //     date.getDay() > this.today.getDay()
  //   ) {
  //     this.profileForm.get('birthDate')?.setValue('');
  //     this.isBirthDate = true;
  //   }
  // }
}
