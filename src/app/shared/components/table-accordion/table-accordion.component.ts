import { Product } from './../../../features/customers/models/product';
import { Component, Input, OnInit } from '@angular/core';
import { BillingAccount } from 'src/app/features/customers/models/billingAccount';
import { Offer } from 'src/app/features/offers/models/offer';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-table-accordion',
  templateUrl: './table-accordion.component.html',
  styleUrls: ['./table-accordion.component.css'],
})
export class TableAccordionComponent implements OnInit {
  @Input() billingAccount!: BillingAccount;
  @Input() customerId!: number;

  constructor(private messageService:MessageService) {}

  ngOnInit(): void {}

  productDetail(billingAccount:BillingAccount,offer:Offer){
      if(offer.type.typeName == 'campaign'){
        let cnAddress = billingAccount.addresses.toString();
        let cnProdOfferId = offer.id.toString();
        let cnProdOfferName = offer.name;
        let cnCampaignId = offer.type.id.toString();        
        this.messageService.add({
          key: 'okey',            
          sticky: true,
          severity: 'warn',
          detail:
          'ProdOfferId:'+cnProdOfferId+'                '+
          'ProdOfferName:'+cnProdOfferName+'   '+
          'CampaignId'+cnCampaignId,            
        });  
      }
      else if(offer.type.typeName == 'catalog'){
        let cgAddress = billingAccount.addresses;
        let cgProdOfferId = offer.id;
        let cgProdOfferName = offer.name;
        this.messageService.add({
          key: 'okey',            
          sticky: true,
          severity: 'warn',
          detail:
          'ProdOfferId:'+cgProdOfferId+'                '+
          'ProdOfferName:'+cgProdOfferName+'   '            
        });
      }


  }
}
