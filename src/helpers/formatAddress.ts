import { FullAddress } from '../_entities/address.entity';
import containsAllNull from './containsAllNull';

export function formatAddress(a: Partial<FullAddress>): string {
  if (containsAllNull(a)) return '';

  const address = [
    a.addressee,
    `${a.street ?? ''} ${a.number ?? ''}`,
    `${a.zip ?? ''} ${a.city ?? ''}`,
    a.country,
  ];

  return address
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(', ');
}
