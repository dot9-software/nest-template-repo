import Timezone from 'timezone-enum';
import { formatTime, formatDate } from '../formatDateTime';

describe('Format date and time based on timezone', () => {
  it('Should format date based on timezone', () => {
    expect(
      formatDate(
        Timezone['Europe/Berlin'],
        new Date('2022-06-30T20:00:00.000Z'),
      ),
    ).toEqual('30.06.2022');
    expect(
      formatDate(
        Timezone['America/New_York'],
        new Date('2022-06-30T20:00:00.000Z'),
      ),
    ).toEqual('30.06.2022');
    expect(
      formatDate(Timezone['Asia/Tokyo'], new Date('2022-06-30T20:30:00.000Z')),
    ).toEqual('01.07.2022');
  });

  it('Should format time based on timezone', () => {
    expect(
      formatTime(
        Timezone['Europe/Berlin'],
        new Date('2022-06-30T20:00:00.000Z'),
      ),
    ).toEqual('22:00');
    expect(
      formatTime(
        Timezone['Europe/Berlin'],
        new Date('2022-12-30T20:00:00.000Z'),
      ),
    ).toEqual('21:00');
    expect(
      formatTime(
        Timezone['America/New_York'],
        new Date('2022-06-30T20:00:00.000Z'),
      ),
    ).toEqual('16:00');
    expect(
      formatTime(Timezone['Asia/Tokyo'], new Date('2022-06-30T20:30:00.000Z')),
    ).toEqual('05:30');
  });
});
