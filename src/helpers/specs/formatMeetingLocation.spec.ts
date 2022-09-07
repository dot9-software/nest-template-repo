import { Address } from '../../_entities/address.entity';
import { MeetingPoint } from '../../_entities/meeting-point.entity';
import { formatMeetingLocation } from '../formatMeetingLocation';

describe('formatMeetingLocation', () => {
  it('should by empty for no meeting location', () => {
    expect(formatMeetingLocation({})).toEqual('');
  });

  it('should by meeting address if no meeting point is specified', () => {
    const meetingPoint = null;
    const meetingAddress: Address = {
      street: 'Teststraße',
      number: '10',
      city: 'Braunschweig',
    };
    expect(formatMeetingLocation({ meetingAddress, meetingPoint })).toEqual(
      'Teststraße 10, Braunschweig',
    );
  });

  it('should by meeting point if no meeting address is specified', () => {
    const meetingPoint = { title: 'Meeting point' } as MeetingPoint;
    const meetingAddress: Address = {};
    expect(formatMeetingLocation({ meetingAddress, meetingPoint })).toEqual(
      'Meeting point',
    );
  });

  it('should by meeting point if meeting point is specified', () => {
    const meetingPoint = { title: 'Meeting point' } as MeetingPoint;
    const meetingAddress: Address = {
      street: 'Teststraße',
      number: '10',
      city: 'Braunschweig',
    };
    expect(formatMeetingLocation({ meetingAddress, meetingPoint })).toEqual(
      'Meeting point',
    );
  });

  it('should include meeting point address if specified', () => {
    const meetingPoint = {
      title: 'Meeting point',
      address: {
        street: 'Hauptstraße',
        number: '10',
        zip: '12345',
        country: 'Deutschland',
      },
    } as MeetingPoint;
    const meetingAddress: Address = {
      street: 'Teststraße',
      number: '10',
      city: 'Braunschweig',
    };
    expect(formatMeetingLocation({ meetingAddress, meetingPoint })).toEqual(
      'Meeting point (Hauptstraße 10, 12345, Deutschland)',
    );
  });
});
