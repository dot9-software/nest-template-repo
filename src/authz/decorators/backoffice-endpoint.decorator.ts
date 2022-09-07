import { SetMetadata } from '@nestjs/common';
import { AuthClasses, authClassMetadataIdentifier } from './auth-classes';

export const BackofficeEndpoint = () =>
  SetMetadata(authClassMetadataIdentifier, AuthClasses.backoffice);
