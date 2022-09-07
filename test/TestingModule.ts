import { TypeOrmModule } from '@nestjs/typeorm';

export const UnitTestingModule = () =>
  TypeOrmModule.forRoot({
    type: 'postgres',
    url: 'postgresql://postgres:docker@localhost:8888/trtestdb',
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    ssl: false,
    extra: {
      ssl: null,
    },
    keepConnectionAlive: true,
  });
