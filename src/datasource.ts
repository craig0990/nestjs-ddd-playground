import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

export default NestFactory.createApplicationContext(AppModule).then(
  async (app) => {
    const dataSource = app.get(DataSource);
    // TypeORM + NestJS will connect by default; disconnect so the CLI can
    // call initialize() itself
    await dataSource.destroy();
    return dataSource;
  },
);
