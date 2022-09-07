import { SetMetadata } from '@nestjs/common';
import { AuthClasses, authClassMetadataIdentifier } from './auth-classes';

export const AdminEndpoint = () =>
  SetMetadata(authClassMetadataIdentifier, AuthClasses.admin);
