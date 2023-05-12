import { TestBed } from '@angular/core/testing'
import { MasterService } from './master.service';
import { ValueService } from './value.service';

fdescribe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(()=>{
    const spy = jasmine.createSpyObj('ValueService',['getValue']);
    TestBed.configureTestingModule({
      providers: [
        MasterService,
        { provide: ValueService, useValue: spy}
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy =  TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  })
  it('should be create', ()=>{
    expect(masterService).toBeTruthy();
  });

  /* it('should return "add text after of:" from MasterService and "my value" from ValueService', () => {
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);
    expect(masterService.getValue()).toBe('add text after of: my value');
  });
  it('should return "add text after of:" from MasterService and "other value" from fake Object', () => {
    const fake = { getValue: ()=>'fake from obj'};
    const masterService = new MasterService(fake as ValueService);
    expect(masterService.getValue()).toBe('add text after of: fake from obj');
  }); */

  it('should call to getValue from ValueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(masterService.getValue()).toBe('add text after of: fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
