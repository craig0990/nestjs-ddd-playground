import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import {
  EMBEDS_CONFIG,
  EmbedsModuleOptions,
  EMBEDS_CONFIG_DEFAULT,
} from './config.type';
import { CreatedSubscriber } from './created';
import { UpdatedSubscriber } from './updated';

@Global()
@Module({})
export class TypeOrmConcernsModule {
  static forRoot(options: Partial<EmbedsModuleOptions> = {}): DynamicModule {
    const configProvider: Provider = {
      provide: EMBEDS_CONFIG,
      useValue: { ...EMBEDS_CONFIG_DEFAULT, ...options },
    };

    const subscribers: Provider[] = [CreatedSubscriber, UpdatedSubscriber];

    return {
      module: TypeOrmConcernsModule,
      imports: [ClsModule],
      providers: [configProvider, ...subscribers],
      exports: [configProvider],
    };
  }
}
