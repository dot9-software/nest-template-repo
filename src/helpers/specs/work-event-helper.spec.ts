import Timezone from 'timezone-enum';
import { Address } from '../../_entities/address.entity';
import { BillingType } from '../../_entities/billing-type.entity';
import { LicenseCategory } from '../../_entities/common/license-category';
import { MeetingPoint } from '../../_entities/meeting-point.entity';
import { Organization } from '../../_entities/organization.entity';
import { User } from '../../_entities/user.entity';
import { WorkEvent } from '../../_entities/work-event.entity';
import { hasTimeDiff, hasMeetingPointDiff } from '../work-event-helper';

// mock data
const shared_org: Organization = {
  name: 'Test Org',
  annual_vacation_days: 3,
  contact_info: { address: {} },
  full_time_hours: 300,
  id: 'orghaha',
  banking_info: {},
  timezone: Timezone['Europe/Berlin'],
};

const addresses: Address[] = [
  {
    city: 'Frankfurt',
    country: 'Costa Rica',
    number: '23',
    street: 'Strasse',
    zip: '12345',
  },
  {
    city: 'Lisbon',
    country: 'Antarctica',
    number: '23',
    street: 'Strasse',
    zip: '12345',
  },
];

const meeting_points: MeetingPoint[] = [
  {
    address: addresses[0],
    id: '1234',
    organization: shared_org,
    title: 'Meeting Point',
  },
  {
    address: addresses[1],
    id: '5678',
    organization: shared_org,
    title: 'Treffpunkt',
  },
];

const shared_billing_type: BillingType = {
  duration_minutes: 1,
  id: 'abc',
  licenseCategory: LicenseCategory.CAR_B,
  organization: shared_org,
  price: 12,
  requiresDescription: false,
  shadow_time: 4,
  title: 'this is a title',
  trackable: true,
};

const instructor: User = new User('something');

const previousEvent: WorkEvent = {
  id: 'unused',
  billingType: shared_billing_type,
  description: 'something',
  start_time: new Date('2020-12-12'),
  end_time: new Date('2020-12-13'),
  organization: shared_org,
  user: instructor,
  meetingAddress: addresses[0],
  meetingPoint: meeting_points[0],
};

const otherInstructor: User = new User('something_else');

// date or time changes that require an email to be sent
const changesRequireTimeDiff: Partial<WorkEvent>[] = [
  { start_time: new Date('2020-12-11') },
  { end_time: new Date('2020-12-14') },
  { start_time: new Date('2020-12-11'), end_time: new Date('2020-12-14') },
  { start_time: new Date('2020-12-12'), end_time: new Date('2020-12-14') },
];

// meeting point changes that require an email to be sent
const changesRequireMeetingPointDiff: Partial<WorkEvent>[] = [
  { meetingPoint: meeting_points[1] },
  { meetingAddress: addresses[1] },
];

const changesNoEmailDiff: Partial<WorkEvent>[] = [
  // no changes
  {},

  // same timestamps
  { end_time: new Date('2020-12-13') },
  { start_time: new Date('2020-12-12') },
  { start_time: new Date('2020-12-12'), end_time: new Date('2020-12-13') },

  // same instructor
  { user: instructor },

  // same address / same meeting point
  { meetingAddress: addresses[0] },
  { meetingPoint: meeting_points[0] },

  // changes with nothing important for student
  { description: 'something else' },
  {
    vehicle: {
      licenseCategory: LicenseCategory.CAR_B,
      organization: shared_org,
      license_plate: 'VRRMM',
    },
  },
];

// tests
describe('Work Event Helper', () => {
  changesRequireTimeDiff.forEach((change, idx) => {
    it(`[test requires diff] #${idx} has time diff true`, () => {
      expect(hasTimeDiff(previousEvent, change)).toBe(true);
    });
  });

  changesRequireMeetingPointDiff.forEach((change, idx) => {
    it(`[test requires diff] #${idx} has meeting point diff true`, () => {
      expect(hasMeetingPointDiff(previousEvent, change)).toBe(true);
    });
  });

  changesNoEmailDiff.forEach((change, idx) => {
    it(`[test requires no diff] #${idx} has email diff false`, () => {
      expect(hasTimeDiff(previousEvent, change)).toBe(false);
      expect(hasMeetingPointDiff(previousEvent, change)).toBe(false);
    });
  });
});
