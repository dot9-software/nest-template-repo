import { SetMetadata } from '@nestjs/common';
import { AuthClasses, authClassMetadataIdentifier } from './auth-classes';

export const InstructorEndpoint = () =>
  SetMetadata(authClassMetadataIdentifier, AuthClasses.instructor);
