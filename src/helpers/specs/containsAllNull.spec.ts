import * as dayjs from 'dayjs';
import containsAllNull from '../containsAllNull';

describe('Contains all Null', () => {
  it('Should return true iff object contains null and undefined', () => {
    expect(
      containsAllNull({ a: null, b: undefined, c: null, d: null }),
    ).toEqual(true);
  });

  it('Should return false if object contains null, undefined and falsy values', () => {
    expect(containsAllNull({ a: null, b: undefined, c: '' })).toEqual(false);
    expect(containsAllNull({ a: null, b: undefined, c: 0 })).toEqual(false);
    expect(containsAllNull({ a: null, b: undefined, c: -0 })).toEqual(false);
    expect(containsAllNull({ a: null, b: undefined, c: NaN })).toEqual(false);
    expect(containsAllNull({ a: null, b: undefined, c: false })).toEqual(false);
  });

  it('Should return false if object contains truthy values', () => {
    expect(containsAllNull({ a: {} })).toEqual(false);
    expect(containsAllNull({ a: 'String!' })).toEqual(false);
    expect(containsAllNull({ a: 9001 })).toEqual(false);
    expect(containsAllNull({ a: Infinity })).toEqual(false);
  });

  it('Should return false if object contains both truthy and falsy values', () => {
    expect(containsAllNull({ a: {}, b: null })).toEqual(false);
    expect(containsAllNull({ a: 'stringy', b: null })).toEqual(false);
    expect(containsAllNull({ a: {}, b: undefined })).toEqual(false);
    expect(containsAllNull({ a: 'stringy', b: undefined })).toEqual(false);
  });

  it('Should return true if object contains nothing', () => {
    expect(containsAllNull({})).toEqual(true);
  });

  it('Should return true if object is null or undefined', () => {
    expect(containsAllNull(null)).toEqual(true);
    expect(containsAllNull(undefined)).toEqual(true);
  });

  it('Should return true if object is falsy value', () => {
    expect(containsAllNull(0)).toEqual(true);
    expect(containsAllNull('')).toEqual(true);
    expect(containsAllNull(false)).toEqual(true);
  });

  it('Should return true if object is constructed Object', () => {
    expect(containsAllNull(new Object())).toEqual(true);
    expect(containsAllNull(new Array())).toEqual(true);
    expect(containsAllNull(new String())).toEqual(true);

    // JS Date quirkyness
    expect(containsAllNull(new Date())).toEqual(true);
    expect(containsAllNull(new Date('2022-01-01'))).toEqual(true);
  });

  it('Should return false if object is Dayjs Object', () => {
    expect(containsAllNull(dayjs())).toEqual(false);
    expect(containsAllNull(dayjs(1652351421111))).toEqual(false);
    expect(containsAllNull(dayjs('2020-01-01'))).toEqual(false);
  });
});
