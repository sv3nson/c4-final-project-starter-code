import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk-core')
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
        const params = {
            Bucket: this.bucketname,
            Key: key,
            Expires: urlExpiration
        }
        const signedUrl = this.s3.getSignedUrl('putObject', params);
        return signedUrl
    }
}