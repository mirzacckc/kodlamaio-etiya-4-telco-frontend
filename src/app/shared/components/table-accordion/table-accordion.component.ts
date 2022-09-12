import { Component, Input, OnInit } from '@angular/core';
import { BillingAccount } from 'src/app/features/customers/models/billingAccount';
import { Offer } from 'src/app/features/offers/models/offer';
import { MessageService } from 'primeng/api';
import { CustomersService } from 'src/app/features/customers/services/customer/customers.service';
import { Customer } from 'src/app/features/customers/models/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-accordion',
  templateUrl: './table-accordion.component.html',
  styleUrls: ['./table-accordion.component.css'],
})
export class TableAccordionComponent implements OnInit {
  @Input() billingAccount!: BillingAccount;
  @Input() customerId!: number;
  customer!: Customer;
  billingAccountToDelete!: BillingAccount;

  constructor(
    private messageService: MessageService,
    private customerService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCustomerById();
    this.messageService.clearObserver.subscribe((data) => {
      if (data == 'reject') {
        this.messageService.clear();
      } else if (data == 'confirm') {
        if (
          this.billingAccountToDelete.orders &&
          this.billingAccountToDelete.orders.length > 0
        ) {
          this.messageService.clear();
          this.messageService.add({
            key: 'offer',
            severity: 'warn',
            detail:
              'There is a product belonging to the account, this account cannot be deleted',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 3000);
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 'offer',
            severity: 'warn',
            detail: 'Customer account deleted successfully',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 3000);
          this.remove();
        }
      }
    });
  }

  productDetail(billingAccount: BillingAccount, offer: Offer) {
    if (offer.type.typeName == 'campaign') {
      let campaignProdOfferId = offer.id.toString();
      let campaignProdOfferName = offer.name;
      let campaignId = offer.type.id.toString();
      let campaignAddressDetail: any = [];
      billingAccount.addresses.forEach(
        (data) => (campaignAddressDetail = data)
      );
      this.messageService.add({
        key: 'product-detail',
        sticky: true,
        severity: 'warn',
        detail:
          'Prod Offer Id: ' +
          campaignProdOfferId +
          '       ' +
          'Prod Offer Name: ' +
          campaignProdOfferName +
          '       ' +
          'Campaign Id: ' +
          campaignId +
          '       ' +
          campaignAddressDetail.city.name +
          '       ' +
          campaignAddressDetail.description +
          '       ',
      });
    } else if (offer.type.typeName == 'catalog') {
      let catalogProdOfferId = offer.id;
      let catalogProdOfferName = offer.name;
      let catalogAddressDetail: any = [];
      billingAccount.addresses.forEach((data) => (catalogAddressDetail = data));
      this.messageService.add({
        key: 'product-detail',
        sticky: true,
        severity: 'warn',
        detail:
          'ProdOfferId: ' +
          catalogProdOfferId +
          '         ' +
          'ProdOfferName: ' +
          catalogProdOfferName +
          '          ' +
          'Address Name: ' +
          catalogAddressDetail.city.name +
          '          ' +
          'Address Description: ' +
          catalogAddressDetail.description +
          '          ',
      });
    }
  }

  getCustomerById() {
    if (this.customerId == undefined) {
      //toast
    } else {
      this.customerService
        .getCustomerById(this.customerId)
        .subscribe((data) => {
          this.customer = data;
        });
    }
  }

  removePopup(billinAccount: BillingAccount) {
    this.billingAccountToDelete = billinAccount;
    this.messageService.add({
      key: 'c',
      sticky: true,
      severity: 'warn',
      detail: 'Are you sure you want to delete?',
    });
  }

  remove() {
    this.customerService
      .removeBillingAccount(this.billingAccountToDelete, this.customer)
      .subscribe((data) => {
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      });
  }

  updateBillingAccount(billingAccount: BillingAccount) {
    this.router.navigateByUrl(
      `/dashboard/customers/${this.customerId}/customer-bill/update/${billingAccount.id}`
    );
  }
}
