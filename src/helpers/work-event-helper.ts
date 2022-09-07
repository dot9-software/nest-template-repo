import { WorkEvent } from '../_entities/work-event.entity';
import { doRangesOverlap } from './date-helper';
import { formatAddress } from './formatAddress';

/**
 * hasTimeDiff returns whether there was a change in the event date or time
 * that'd require the student to be notified about.
 * @param {WorkEvent} oldEvent event before edit
 * @param {Partial<WorkEvent>} newEvent event after edit
 * @returns {boolean} result
 */
export function hasTimeDiff(
  oldEvent: WorkEvent,
  newEvent: Partial<WorkEvent>,
): boolean {
  const newEnd = newEvent.end_time?.getTime?.();
  const newStart = newEvent.start_time?.getTime?.();

  return !!(
    (newEnd && oldEvent.end_time.getTime() != newEnd) ||
    (newStart && oldEvent.start_time.getTime() != newStart)
  );
}

/**
 * hasMeetingPointDiff returns whether there was a change in the meeting point or address
 * that'd require the student to be notified about.
 * @param {WorkEvent} oldEvent event before edit
 * @param {Partial<WorkEvent>} newEvent event after edit
 * @returns {boolean} result
 */
export function hasMeetingPointDiff(
  oldEvent: WorkEvent,
  newEvent: Partial<WorkEvent>,
): boolean {
  const newMeetingPointId = newEvent.meetingPoint?.id;
  const newAddress = newEvent.meetingAddress;

  return !!(
    (newMeetingPointId && oldEvent.meetingPoint?.id != newMeetingPointId) ||
    (newAddress &&
      formatAddress(oldEvent.meetingAddress) != formatAddress(newAddress))
  );
}

/**
 * Check for the availability of a ressource linked to calendar events in a timeframe
 * @param events events that indicate the bookings of a ressource
 * @param range the range that will be checked for availability
 * @param ignoreEventId one event that will be ignored - useful if this event is to be changed and contains the ressource
 * @returns {boolean}
 */
export function checkAvailability(
  events: WorkEvent[],
  range: { start: Date; end: Date },
  ignoreEventId?: string,
): boolean {
  // vehicle is available, if there is no event that: isnt ignored and has overlap
  return !events.some(
    (e) =>
      e.id !== ignoreEventId &&
      doRangesOverlap(range.start, range.end, e.start_time, e.end_time),
  );
}
