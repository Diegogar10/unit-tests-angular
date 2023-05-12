import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ProductsService } from './products.service';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '../interceptor/token.interceptor';
import { TokenService } from './token.service';

fdescribe('ProductsService', () => {
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  afterEach(()=>httpController.verify());

  describe('test for getAllSimple', ()=> {
    it('should return a product list', (doneFn)=> {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productService.getAllSimple()
      .subscribe(data => {
        //Assert
        expect(data.length).toBe(data.length);
        expect(data).toEqual(mockData);
        doneFn();
      });
      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`)
      req.flush(mockData);
    })
  });

  describe('test for getByPage', ()=> {
    it('should return a product list', (doneFn)=> {
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productService.getProductsByPage(10,3)
      .subscribe(data => {
        //Assert
        expect(data.length).toBe(data.length);
        //expect(data).toEqual(mockData);
        doneFn();
      });
      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=10&offset=3`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${10}`);
      expect(params.get('offset')).toEqual(`${3}`);

    });
    it('should return product list with taxes', (doneFn) => {
      //Arrange
      const mockData: Product[] = [{
        ...generateOneProduct(),
        price: 100,
      },
      {
        ...generateOneProduct(),
        price: 200
      }];
      //Act
      productService.getProductsByPage(10,2)
      .subscribe(data => {
        //Assert
        expect(data.length).toBe(data.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        doneFn();
      });
      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=10&offset=2`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    })
  });

  describe('test for create',()=> {
    it('should retur new product', (doneFn)=>{
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        categoryId: 12,
        price: 100,
        title: 'new Product',
        images: ['img'],
        description: 'bla bla bla'
      }
      //Act
      productService.create({...dto})
      .subscribe(data => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
      //http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    })
  });
  describe('test for update', () => {
    it('should update a product', (doneFn)=> {
      //Arrange
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'edit product'
      }
      const productId = '1';
      //Act
      productService.update(productId, {...dto})
      .subscribe((data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      })
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn)=> {
      //Arrange
      const mockData = true;
      const productId = '1';
      //Act
      productService.delete(productId)
      .subscribe((data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      })
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getProduct', () => {
    it('should return a product', (doneFn)=> {
      //Arrange
      const mockData: Product = generateOneProduct();
      const productId = '1';
      //Act
      productService.getProduct(productId)
      .subscribe((data) => {
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      })
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right msg when status code is 404', (doneFn)=> {
      //Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }
      //Act
      productService.getProduct(productId)
      .subscribe({
        error: (error) => {
          //Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      })
      //http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
