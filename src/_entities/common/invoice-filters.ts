/**
 * Status flags that can be added to the invoice patch dto to perform some action and update the db accordingly
 * Example: PATCH {status: SENT} sends the invoice to the student by mail
 */
export enum InvoiceStatus {
  SENT = 'SENT',
  FINALIZED = 'FINALIZED',
}

/**
 * Filters for invoice list endpoints that filter by the payment status of the invoice
 */
export enum InvoiceStatusFilter {
  PAID = 'PAID',
  PARTLY_PAID = 'PARTLY_PAID',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  OPEN = 'OPEN',
}

export enum InvoiceSort {
  INSTRUCTOR = 'INSTRUCTOR',
  DUE_DATE = 'DUE_DATE',
}
