import { mongodb } from '@dekproject/scope'
import { uploadS3, uploadThumbor } from '../controllers/s3'


export const routineUploadImagesS3 = async (req, res) => {
  try {
    const pages = await getPages();
    await Promise.all(pages.map(async page => {
      uploadAvatar(page)
      uploadMiniAvatar(page)
      uploadCover(page)
    }))
    res.json(pages.map(p => p.url))
  } catch (error) {
    res.status(500).send()
  }
}
const uploadAvatar = async ({ url: filename, ref, avatar }) => {
  if (!avatar) return
  const { url, original, key } = await uploadS3({
    type: 'avatar',
    hash: ref,
    filename,
    image: avatar
  })
  mongodb.collection("pages").update(
    {
      ref
    },
    {
      $set: {
        "images.avatar": {
          url,
          original,
          key
        },
        avatar: null
      }
    }
  )
}


const uploadMiniAvatar = async ({ url: filename, ref, miniavatar }) => {
  if (!miniavatar) return;
  const { url, original, key } = await uploadS3({
    type: 'miniavatar',
    hash: ref,
    filename,
    image: miniavatar
  })
  mongodb.collection("pages").update(
    {
      ref
    },
    {
      $set: {
        "images.miniavatar": {
          url,
          original,
          key
        },
        miniavatar: null
      }
    }
  )
}

const uploadCover = async ({ url: filename, ref, cover }) => {
  if (!cover) return;
  const { url, original, key } = await uploadS3({
    type: 'cover',
    hash: ref,
    filename,
    image: cover
  })

  const minicover  = uploadThumbor({ url, type: 'minicover' })


  mongodb.collection("pages").update(
    {
      ref
    },
    {
      $set: {
        "images.cover": {
          url,
          original,
          key
        },
        "images.minicover": {
          url: minicover,
          original,
          key
        },
        cover: null
      }
    }
  )
}

const getPages = async (skip, limit) => {
  const pages = await mongodb.collection('pages').find({
    $and: [{
      removed: {
        $not: {
          $eq: true
        }
      },
    }, {
      images: {
        $not: {
          $eq: false
        }
      }
    }, {
      avatar: { $not: { $eq: '' } }
    }, {
      avatar: { $not: { $eq: null } }
    }]
  })
    .project({
      avatar: 1,
      cover: 1,
      miniavatar: 1,
      ref: 1,
      url: 1,
    })
    .sort({
      feedbackDate: -1
    })
    .skip(skip || 0)
    .limit(limit || 100)
    .toArray()
  return pages
}

