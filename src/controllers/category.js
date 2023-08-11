

import { mongodb } from '@dekproject/scope'
import { cache } from '../core/cache'
export const getAllCategory = async () => {
  return new Promise(resolve => {
    cache("manager", "categories").then(categories => {
      resolve(categories)
    }).catch(async () => {
      let categories = []
      try {
        categories = await mongodb.collection('categories').find({
          deleted: {
            $not: {
              $eq: true
            }
          }
        }).toArray()

        Promise.all(categories.map(async category => {
          await cache("categories", category.text, category)
        }))
        await cache("manager", "categories", categories)
      } catch (err) {
        categories = []
      }
      resolve(categories)
    })
  })
}

export const getCategoryByText = async (text) => {
  return new Promise(resolve => {
    cache("categories", text).then(category => {
      resolve(category)
    }).catch(async () => {
      let category = {}
      try {
        category = await mongodb.collection('categories').findOne({
          deleted: {
            $not: {
              $eq: true
            }
          },
          text
        })
        await cache("categories", category.text, category)
      } catch (err) {
        
      }
      resolve(category)
    })
  })
}

