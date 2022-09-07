import { WorkEvent } from '../_entities/work-event.entity';
import containsAllNull from './containsAllNull';
import { formatAddress } from './formatAddress';

// an event has either a meeting point or an address
export function formatMeetingLocation(event: Partial<WorkEvent>) {
  if (event?.meetingPoint) {
    let location = event.meetingPoint.title ?? '';
    if (!containsAllNull(event.meetingPoint.address)) {
      location += ` (${formatAddress(event.meetingPoint.address)})`;
    }
    return location.trim();
  }
  return formatAddress(event.meetingAddress);
}
