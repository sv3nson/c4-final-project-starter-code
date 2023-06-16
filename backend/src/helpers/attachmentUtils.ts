import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = 300

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketname = s3Bucket
    ) { }

    getAttachmentUrl(key: string) {
        return `https://${this.bucketname}.s3.amazonaws.com/${key}`
    }

    getUploadUrl(key: string) {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketname,
            Key: key,
            Expires: urlExpiration
        }) as string
    }
}