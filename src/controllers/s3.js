import AWS from 'aws-sdk'
import md5 from 'md5'
import { promisify } from 'util'
import Thumbor from 'thumbor'


/**
 * No .env deve existir 
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * Caso não exista descomente as linhas abaixos e passe os valores corretos
 */

/*
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
*/

const s3 = new AWS.S3(
  {
    params: {
      Bucket: process.env.BUCKET_NAME,
    }
  }
)
const uploadS3Async = promisify(s3.upload).bind(s3)
const getObject = promisify(s3.getObject).bind(s3)


const thumbor = new Thumbor(
  process.env.THUMBOR_ACCESS_KEY,
  process.env.THUMBOR_SERVER_HOST
)


export const uploadS3 = async ({ image, hash, filename, type }) => {
  let params = {
    ACL: 'public-read',
    ContentType: "image/jpeg",
    Body: new Buffer.from(image.replace("data:image/jpeg;base64,", ""), 'base64'),
    Key: hashFolder(filename, hash, type),
  }

  try {
    const { Location: url, key } = await uploadS3Async(params)
    const thumborURL = uploadThumbor({ url, type })

    return {
      url: thumborURL,
      original: url,
      key
    }
  } catch (error) {
    return error
  }
}

export const uploadThumbor = ({ url, type, width, height }) => {

  if (type) {
    const typeImage = typesImages[type]
    width = typeImage.width
    height = typeImage.height
  }
  else if (width == undefined || height == undefined) {
    return new Error('Required width and height')
  }

  if (typeof url != 'string')
    return new Error('Required url')

  return thumbor.setImagePath(url).resize(width, height).buildUrl();
}

const typesImages = {
  avatar: {
    width: 300,
    height: 300
  },
  miniavatar: {
    width: 50,
    height: 50
  },
  cover: {
    width: 1500,
    height: 600
  },
  minicover: {
    width: 500,
    height: 200
  },
}

const hashFolder = (filename, hash = null, classification = null) => {
  hash = md5(hash || filename)
  let hashFolder = `${classification ? classification + '/' : ''}${hash.substring(0, 1)}/${hash.substring(1, 4)}/${hash.substring(4, 7)}/${hash.substring(7, 10)}/${hash.substring(10, 13)}/${hash.substring(13, 16)}/${filename}.jpg`

  return hashFolder
}

