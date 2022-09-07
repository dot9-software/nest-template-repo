import { ChildEntity } from 'typeorm';
import { CalendarEntry } from './calendar-entry.entity';

@ChildEntity()
export class VacationEvent extends CalendarEntry {}
