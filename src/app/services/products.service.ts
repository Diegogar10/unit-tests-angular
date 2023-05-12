import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Product, CreateProductDTO, UpdateProductDTO} from '../models/product.model';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/v1`;
  constructor(
    private http: HttpClient
  ) { }
  get allProducts() {
    return this.http.get<Product[]>(this.apiUrl+'/products');
  }
  getAllSimple() {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse)=>{
        if(error.status === HttpStatusCode.Conflict) {
          return throwError(()=>'Algo fallo en el servidor');
        }
        if(error.status === HttpStatusCode.NotFound) {
          return throwError(()=>'El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized) {
          return throwError(()=>'Tu acceso no es permitido');
        }
        if(error.status === HttpStatusCode.Unused) {
          return throwError(()=>'Servidor en desuso');
        }
        return throwError(()=>'Ups algo salio mal');
      })
    );
  }

  getProductsByPage(limit: number, offset: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`,{
      params: {limit, offset}
    })
    .pipe(
      map((products)=> products.map(item => {
        return {
          ...item,
          taxes: 0.19 * item.price
        }
      }))
    );
  }
  create(data: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl+'/products', data);
  }
  update(id: string, dto: UpdateProductDTO) {
    //put enviar todo el cuerpo o info del producto
    //patch solo enviamos el atributo que queremos modificar
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
  }
  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }
  getByCategory (categoryId: string , limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, {params});
  }
}
