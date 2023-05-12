import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  constructor(
    private productServices: ProductsService
  ) {}

  ngOnInit(): void {
    this.productServices.getAllSimple()
    .subscribe(products => {
      this.products = products;
    })
  }
}
