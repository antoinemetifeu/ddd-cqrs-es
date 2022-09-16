import { BaseException } from './base.exception';

export class PendingRetributionInvoiceException extends BaseException {
  constructor() {
    super('Already have pending invoice');
  }
}
