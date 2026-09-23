import { Component, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { catchError, EMPTY, Subscription } from 'rxjs';
import { ProductService } from '../product.service';
import { HttpErrorService } from '../../utilities/http-error.service'

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() productId: number = 0;
  errorMessage = '';
  productSub!: Subscription;
  private productService = inject(ProductService);

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if(id) {
      this.productSub = this.productService.getProduct(id)
      .pipe(
          catchError(err => {
            this.errorMessage = err
            return EMPTY; 
          }),
      )
      .subscribe(
        product => this.product = product
      );
    }
  }
  ngOnDestroy(): void {
    if(this.productSub) {
      this.productSub.unsubscribe();
    }
  }
  addToCart(product: Product) {
  }
}
