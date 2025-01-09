import { ObjectCannedACL, PutObjectCommand, S3Client, CopyObjectCommand, DeleteObjectCommand  } from '@aws-sdk/client-s3';
import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FileUtilService {

  private s3Client : S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_REGION'),
      credentials : {        
          accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get<string>('S3_SECRET_ACCESS_KEY'),
      },

    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME');
  }

  async uploadFile(file: any, fileName : any): Promise<any> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: "img/"+fileName, 
      Body: file.buffer,
      ContentType: file.mimetype,
      //ACL: ObjectCannedACL.public_read
    };

    const command = new PutObjectCommand(uploadParams);

    const uploadFileS3 = await this.s3Client.send(command);
    if (uploadFileS3.$metadata.httpStatusCode !== 200)
    return uploadFileS3
  }

  async renameFile(oldKey: string, newKey: string): Promise<void> {
    // 1. 파일 복사

    if(oldKey == newKey){
      return
    }

    
    try {
      const copyParams = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${oldKey}`,
        Key: newKey,
      };

 
  
      const copyCommand = new CopyObjectCommand(copyParams);
      await this.s3Client.send(copyCommand);
  
      // 2. 원본 파일 삭제
      const deleteParams = {
        Bucket: this.bucketName,
        Key: oldKey,
      };
  
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(deleteCommand);
    } catch (error) {
      // console.log(oldKey, newKey, "s3file copy delete error", error)
    }


  }

      
}
