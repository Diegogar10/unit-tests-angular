import { TestBed } from '@angular/core/testing'
import { ValueService } from './value.service';

fdescribe('ValueService', () => {
  let service: ValueService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    });
    service = TestBed.inject(ValueService);
  })

  it('should be create', ()=> {
    expect(service).toBeTruthy();
  });

  describe('test for getValue', ()=> {
    it('should return "my value"',()=> {
      expect(service.getValue()).toBe('my value');
    })
  });

  describe('test for setValue', ()=> {
    it('should change the value',()=> {
      expect(service.getValue()).toBe('my value');
      expect(service.setValue('change'));
      expect(service.getValue()).toBe('change');
    })
  });

  describe('test for getPromiseValue', ()=> {
    it('should return "promise value" of promise with then',(doneFn)=>{
      service.getPromiseValue()
      .then((value)=> {
        expect(value).toEqual('promise value');
        doneFn(); // le decimos de forma explicita cuando termina la prueba para caso de promesas
      });
    });
  });

  describe('test for getPromiseValue', ()=> {
    it('should return "promise value" of promise with async/await', async ()=>{
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    });
  });

  describe('test for getObservable', ()=> {
    it('should return "observable Value"',(doneFn)=>{
      service.getObservable()
      .subscribe((value)=>{
        expect(value).toBe('observable Value');
        doneFn();
      })
    })
  })
});
