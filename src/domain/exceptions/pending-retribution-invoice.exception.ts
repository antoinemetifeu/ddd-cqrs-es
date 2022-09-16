import { DomainException } from './domain.exception';

export class PendingRetributionInvoiceException extends DomainException {
  constructor() {
    super('Already have pending invoice');
  }
}
