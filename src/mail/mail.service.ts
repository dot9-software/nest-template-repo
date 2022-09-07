import { Injectable } from '@nestjs/common';
import { MailService as Sendgrid } from '@sendgrid/mail';
import { User } from '../_entities/user.entity';
import { Student } from '../_entities/student.entity';
import { NewEventTemplateData } from './templates/new-event-data';
import { InvoiceData } from './templates/invoice-data';
import { Organization } from '../_entities/organization.entity';
import { WorkEvent } from '../_entities/work-event.entity';
import { UpdateEventDateTemplateData } from './templates/update-event-date-data';
import RethrownError from '../rethrown-error';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { formatMeetingLocation } from '../helpers/formatMeetingLocation';
import { UpdateEventMeetingPointTemplateData } from './templates/update-event-meeting-point-data';
import { formatTime, formatDate } from '../helpers/formatDateTime';
dayjs.extend(utc);
dayjs.extend(timezone);

// see: https://mc.sendgrid.com/dynamic-templates
export enum EMAIL_TEMPLATE {
  EVENT_CREATED = 'd-8179f112786f414198dcf1b5ec6e5407',
  INVOICE_MAIL = 'd-4ab0db0cc83e47a59748ba0dbed7efc5',
  EVENT_DATE_UPDATED = 'd-36266689104a43f696221bb122ab751b',
  EVENT_MEETING_POINT_UPDATE = 'd-a0f9d47166af4a6f8d22bee166d0ba3f',
}

@Injectable()
export class MailService {
  private sendgrid: Sendgrid;

  constructor() {
    this.sendgrid = new Sendgrid();
    this.sendgrid.setApiKey(process.env.SENDGRID_KEY);
  }

  async sendEventEmail(
    templateId: EMAIL_TEMPLATE,
    student: Student,
    instructor: User,
    eventStart: Date,
    eventEnd: Date,
    meetingPoint?: string,
  ) {
    const orgTimezone = student.organization.timezone;
    const dynamicTemplateData: NewEventTemplateData = {
      student_first_name: student?.firstName,
      lesson_date: formatDate(orgTimezone, eventStart),
      instructor_name: `${instructor.firstName} ${instructor.lastName}`,
      lesson_start: formatTime(orgTimezone, eventStart),
      lesson_end: formatTime(orgTimezone, eventEnd),
      meeting_point: meetingPoint,
    };

    try {
      // check if the student has a linked email
      if (!student.email) {
        throw Error(`Student with id ${student?.id} has no email!`);
      }
      await this.sendgrid.send({
        from: process.env.SENDGRID_EMAIL,
        to: student.email,
        templateId,
        dynamicTemplateData,
        replyTo: process.env.SENDGRID_REPLY_TO,
      });
    } catch (error) {
      throw new RethrownError(
        'Error sending email about event to student',
        error,
      );
    }
  }

  async sendEventUpdatedEmail(
    student: Student,
    oldEvent: WorkEvent,
    newEvent: WorkEvent,
    dateChanged: boolean,
    meetingPointChanged: boolean,
  ) {
    // check if the student has a linked email
    if (!student.email) return;

    const orgTimezone = student.organization.timezone;

    if (dateChanged) {
      const dynamicTemplateData: UpdateEventDateTemplateData = {
        first_name: student.firstName,
        new_lesson_date: formatDate(orgTimezone, newEvent.start_time),
        new_lesson_start: formatTime(orgTimezone, newEvent.start_time),
        new_lesson_end: formatTime(orgTimezone, newEvent.end_time),
        old_lesson_date: formatDate(orgTimezone, oldEvent.start_time),
        old_lesson_start: formatTime(orgTimezone, oldEvent.start_time),
        old_lesson_end: formatTime(orgTimezone, oldEvent.end_time),
        new_meeting_point: formatMeetingLocation(newEvent),
      };
      try {
        await this.sendgrid.send({
          from: process.env.SENDGRID_EMAIL,
          to: student.email,
          templateId: EMAIL_TEMPLATE.EVENT_DATE_UPDATED,
          dynamicTemplateData,
          replyTo: process.env.SENDGRID_REPLY_TO,
        });
      } catch (error) {
        throw new RethrownError(
          'Failed to send event date update mail via sendgrid',
          error,
        );
      }
    } else if (meetingPointChanged) {
      const dynamicTemplateData: UpdateEventMeetingPointTemplateData = {
        first_name: student.firstName,
        new_lesson_date: formatDate(orgTimezone, newEvent.start_time),
        new_lesson_start: formatTime(orgTimezone, newEvent.start_time),
        new_lesson_end: formatTime(orgTimezone, newEvent.end_time),
        new_meeting_point: formatMeetingLocation(newEvent),
      };
      try {
        await this.sendgrid.send({
          from: process.env.SENDGRID_EMAIL,
          to: student.email,
          templateId: EMAIL_TEMPLATE.EVENT_MEETING_POINT_UPDATE,
          dynamicTemplateData,
          replyTo: process.env.SENDGRID_REPLY_TO,
        });
      } catch (error) {
        throw new RethrownError(
          'Failed to send event meeting point update mail via sendgrid',
          error,
        );
      }
    }
  }

  async sendInvoiceEmail(
    student: Student,
    org: Organization,
    invoicePdf: Buffer,
    invoice_number: number,
  ): Promise<void> {
    const dynamicTemplateData: InvoiceData = {
      first_name: student?.firstName,
      last_name: student?.lastName,
      organization_name: org.name,
      invoice_number: String(invoice_number),
    };

    try {
      const email = student.billingEmail ?? student.email;
      if (!email) throw new Error(`student ${student.id} has no email`);
      await this.sendgrid.send({
        from: process.env.SENDGRID_EMAIL,
        to: email,
        templateId: EMAIL_TEMPLATE.INVOICE_MAIL,
        attachments: [
          {
            filename: 'Rechnung.pdf',
            content: invoicePdf.toString('base64'),
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
        dynamicTemplateData,
        replyTo: process.env.SENDGRID_REPLY_TO,
      });
    } catch (error) {
      console.error(error);
      throw new RethrownError('error while sending invoice email', error);
    }
  }
}
