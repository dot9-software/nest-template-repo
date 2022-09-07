import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';
import { UserIdContainer } from '../types/IdContainers';
import { faker } from '@faker-js/faker';
import { IsUserIdContainer } from './IsUserIdContainer';

const validator = new Validator();

class TestClass {
  @IsUserIdContainer()
  foo: UserIdContainer;

  constructor(foo: any) {
    this.foo = foo;
  }
}

function validate(value: any) {
  return validator.validate(plainToClass(TestClass, value));
}

describe('IsUserIdContainer', () => {


  it('should reject values that are not objects', async () => {
    let errors = await validate(new TestClass('hello'));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass(''));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass(undefined));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass(null));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass(10));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass(0));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass(['', 'test', undefined]));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass([1, 2, 3]));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass([]));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass(true));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass(false));
    expect(errors.length).toBeGreaterThan(0);
  })

  it('should reject objects with wrong structure', async () => {
    let errors = await validate(new TestClass({}))
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ foo: 'bar' }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ foo: 1, test: true, brille: 'fielmann' }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ not_id: faker.datatype.uuid() }));
    expect(errors.length).toBeGreaterThan(0);
  })

  it('should reject values with invalid id', async () => {
    let errors = await validate(new TestClass({ id: '' }))
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ id: undefined }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ id: null }));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ id: 0 }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ id: 20 }));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ id: [] }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ id: [1, 2, 3] }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ id: ['', undefined, 12, true] }));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ id: true }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ id: false }));
    expect(errors.length).toBeGreaterThan(0);
  })

  it('should accept valid objects', async () => {
    let errors = await validate(new TestClass({ id: faker.datatype.uuid() }))
    expect(errors.length).toEqual(0);
    errors = await validate(new TestClass({ id: '8dd85dfa-2904-47ab-86c6-334a142c942b' }));
    expect(errors.length).toEqual(0);
    errors = await validate(new TestClass({ id: 'this is a valid id' }));
    expect(errors.length).toEqual(0);
  })

})