import { Injectable } from '@nestjs/common';
import { LandingRepository } from './landing.repository';
import { CodeUtilService } from 'src/common/util/codeUtil.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LandingService {

    
    constructor(private readonly landingRepository : LandingRepository , private readonly codeUtilService : CodeUtilService, private readonly configService: ConfigService) {}


    async getContentListService(param): Promise<any>{

        const [result1, result2, result3] = await this.landingRepository.getContentList(param)
        return {contentList : result1, pageInfo : result2, scriptList : result3}

    }

    async getCompScriptService(param): Promise<any>{

        const result1 = await this.landingRepository.getCompScriptList(param)
        return result1
    }


    async getPrivcayServcie(param): Promise<any>{

        const rows = await this.landingRepository.getPrivacy(param)
        return rows[0]

    }

    
    async addRegInfoServcie(param, req): Promise<any>{

        param.reg_ip = req.headers['x-real-ip']

        const result = await this.landingRepository.addRegInfo(param)
        return result

    }

    async updateCountService(param): Promise<any>{

        const result = await this.landingRepository.updateCount(param)
        return result

    }
}
