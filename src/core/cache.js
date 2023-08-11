/**
 * Sistema de cache com redis
 * @author André Ferreira <andrehrf@gmail.com>
 */


import md5 from 'md5'
import { redis } from "@dekproject/scope";
import { promisify } from 'util'

export const cache = async (prefix, ref, data, expire, del) => {
  prefix = 'in-' + prefix;
  let key = prefix + (ref ? formatRef(ref) : '');
  if (prefix === 'getRedis') {
    return new Promise(resolve => { resolve(redis) })
  } else if (data) {
    if (!data.removed) {
      await redis.set(key, JSON.stringify(data))
      if (expire) await redis.expire(key, getExpireTime(expire))
    } else {
      await redis.del(key)
    }
  } else if (del === 'delete') {
    await redis.del(key)
  } else {
    return new Promise((resolve, reject) => {
      redis.get(key, (err, data) => {
        try {
          const parse = JSON.parse(data)
          if (err || parse == null || parse.length === 0) reject(err || key + ' - not found')
          else resolve(parse)
        } catch (error) {
          reject(error || key + ' - error ')
        }
      })
    })
  }
}

export function getExpireTime(time) {
  const expire = {
    inAweek: 302400,
    inAday: 43200,
    inHour: 3600,
    inHalfHour: 1800,
    inFifteenMinutes: 900,
    inFiveMinutes: 300
  }
  if (expire[time]) return expire[time]
  if (typeof time === 'number') return time
  return -1
}

export function formatRef(ref) {
  if (ref !== ':*') {
    return ':' + md5(ref)
  }
  return ref
}


export const redisGet = promisify(redis.get).bind(redis)
export const redisSet = promisify(redis.set).bind(redis)
export const redisDel = promisify(redis.del).bind(redis)
export const redisExpire = promisify(redis.expire).bind(redis)
export const redisKeys = promisify(redis.keys).bind(redis)