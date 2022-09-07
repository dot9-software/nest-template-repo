import { plainToClass } from 'class-transformer';
import { Validator } from 'class-validator';
import { UserIdContainer } from '../types/IdContainers';
import { faker } from '@faker-js/faker';
import { IsUserIdContainer } from './IsUserIdContainer';
import { IsAddress } from './IsAddress';
import { Address } from '../_entities/address.entity';

const validator = new Validator();

class TestClass {
  @IsAddress()
  foo: Address;

  constructor(foo: any) {
    this.foo = foo;
  }
}

function validate(value: any) {
  return validator.validate(plainToClass(TestClass, value));
}

describe('IsAddress', () => {


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

  it('should reject values with non-string members', async () => {
    let errors = await validate(new TestClass({ street: true }))
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ street: 10, number: 0 }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ number: false }));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ country: [], zip: '' }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ zip: [1, 2, 3], city: 'Bielefeld' }));
    expect(errors.length).toBeGreaterThan(0);

    errors = await validate(new TestClass({ street: {} }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ street: { test: 'yes' } }));
    expect(errors.length).toBeGreaterThan(0);
    errors = await validate(new TestClass({ street: { name: undefined } }));
    expect(errors.length).toBeGreaterThan(0);

  })

  it('should accept valid objects', async () => {
    let errors = await validate(new TestClass({ street: faker.address.streetName(), city: faker.address.city(), country: faker.address.country(), zip: faker.address.zipCode() }))
    expect(errors.length).toEqual(0);
    errors = await validate(new TestClass({ street: faker.address.streetName(), city: faker.address.city(), zip: faker.address.zipCode() }));
    expect(errors.length).toEqual(0);
    errors = await validate(new TestClass({}));
    expect(errors.length).toEqual(0);
  })

})