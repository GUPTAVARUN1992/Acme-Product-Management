import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from './product';
import { catchError, map, Observable, of, switchMap, tap, EMPTY } from 'rxjs';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);
  private errorMessage: string = "";
  readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('fetched products')),
      catchError(err => this.handeError(err))
    );

  getProduct(id: number) : Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url)
    .pipe(
      tap(() => console.log(`fetched product id=${id}`)),
      switchMap(product => this.getProductWithReviews(product)),
      catchError(err => this.handeError(err))
    );
  }

  private getProductWithReviews(product: Product) : Observable<Product> {
    if(product.hasReviews)
    {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        map(reviews => ({...product, reviews} as Product))
      )
    }
    else {
      return of(product);
    }
  }
  private handeError(err : HttpErrorResponse)
  {
    this.errorMessage =  this.errorService.formatError(err);
    return new Observable<Product>();
  }

}
