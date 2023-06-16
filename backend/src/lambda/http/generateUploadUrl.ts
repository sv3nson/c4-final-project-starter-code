import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createAttachmentPresignedUrl, updateTodoAttachmentUrl } from '../../bizlogic/todos'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const key = todoId + "_" + userId
    const url = await createAttachmentPresignedUrl(key)
    
    await updateTodoAttachmentUrl(userId, todoId, `https://${s3Bucket}.s3.amazonaws.com/${key}`)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
