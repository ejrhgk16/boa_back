import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CodeUtilService } from './codeUtil.service';
import { FileUtilService } from './fileUtil.service';



@Global()
@Module({
  providers: [CodeUtilService, FileUtilService],
  exports: [CodeUtilService, FileUtilService],

})
export class UtilModule{}