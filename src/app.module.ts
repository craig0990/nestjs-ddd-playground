import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { Note } from './claims/infrastructure/entities/note.entity';
import { Thread } from './claims/infrastructure/entities/thread.entity';
import { ExpenseClaim } from './claims/infrastructure/entities/expense_claim.entity';
import { EscalatedLineItem } from './claims/infrastructure/entities/escalated_line_item';
import { ExpenseClaimLineItem } from './claims/infrastructure/entities/expense_claim_line_item';
import { TypeOrmConcernsModule } from './typeorm-concerns';
import { SnakeCaseNamingStrategy } from './shared/infrastructure/snake_case_naming.strategy';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '1423'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          ExpenseClaim,
          EscalatedLineItem,
          ExpenseClaimLineItem,
          Thread,
          Note,
        ],
        namingStrategy: new SnakeCaseNamingStrategy(),
        synchronize: true,
        logging: true,
        options: {
          trustServerCertificate: true,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmConcernsModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
