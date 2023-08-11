

import bcrypt from 'bcrypt-nodejs'
import jwt from 'jwt-simple'
import md5 from 'md5'
import passport from 'passport'
import { mongodb } from "@dekproject/scope"
import { Strategy, ExtractJwt } from 'passport-jwt'
import { ObjectId } from 'mongodb'
import { equalsOrError, existsOrError, notExistsOrError } from '../core/validation'

const encryptPassword = password => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}


const BASE_URL = process.env.BASE_URL

export const signinLocal = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).send('Informe usuário e senha!')


    const user = await mongodb.collection('users').findOne({
      $or: [{
        "profile.local.email": username.toLowerCase()
      },
      {
        "profile.local.username": username.toLowerCase()
      }
      ]
    })

    if (!user)
      return res.status(400).send('Usuário não encontrado')


    if (user.profile.local.password) {
      const isMatch = bcrypt.compareSync(password, user.profile.local.password)
      if (!isMatch)
        return res.status(401).send('Senha Incorreta')
    } else {
      if (user.profile.local.pass !== md5(password))
        return res.status(401).send('Senha Incorreta')
      else {
        await mongodb.collection('users').updateOne({
          _id: ObjectId(user._id)
        }, {
            $set: {
              "profile.local.password": encryptPassword(password)
            },
            $unset: {
              "profile.local.pass": ''
            }
          })
      }
    }


    if (user.blacklist)
      return res.status(401).send('Usuário Banido')


    const payload = await getPayloadJWT(user._id, 'local')

    res.apiSend(payload)


  } catch (error) {
    res.apiError(error)
  }
}

export const validateToken = async (req, res) => {
  const userData = req.body || null
  try {
    if (userData) {
      const token = jwt.decode(userData.token, process.env.SESSION_SECRET)
      if (new Date(token.exp * 1000) > new Date()) {
        return res.send(true)
      }
    }
  } catch (e) {
    // problema com o token
  }

  res.send(false)
}

export const getUserByToken = async (req, res) => {
  const userData = req.body || null
  try {
    if (userData) {
      let token = jwt.decode(userData.token, process.env.SESSION_SECRET)
      if (new Date(token.exp * 1000) > new Date()) {
        delete token.iat
        delete token.exp
        return res.json(token)
      }
    }
  } catch (e) {
    // problema com o token
  }

  res.status(401).send()
}

export const checkAvailable = async (req, res) => {
  try {
    const { key, value, type } = req.body

    let query = {}
    if (key == 'email') {
      query = {
        emails: {
          $in: [value]
        }
      }
    } else if (key == 'user') {
      query = {
        "profile.local.user": value
      }
    }

    const userFromDB = await mongodb.collection('users').findOne(query, { _id: 1 })

    notExistsOrError(userFromDB, `${type ? type : key} já está em uso`)
    res.apiSend()
  } catch (error) {
    res.apiError(error)
  }
}

export const signinWithGoogle = async (req, res) => {
  try {
    const { profile } = req.body

    const userId = await integrationWithGoogle(profile)

    const payload = await getPayloadJWT(userId, 'google')

    res.apiSend(payload)
  } catch (error) {
    res.apiError(error)
  }
}

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  if (id) {
    mongodb.collection('users').findOne({
      $or: [{
        _id: id
      }, {
        _id: ObjectId(id)
      }]
    }, (err, user) => {
      if (user) {
        delete user['pass']
        return done(null, user);
      }
      else return done(err, null)
    });
  } else {
    return done("Invalid ID", null);
  }
});


const params = {
  secretOrKey: process.env.SESSION_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategy = new Strategy(params, (payload, done) => {
  if (payload.id) {
    mongodb.collection('users').findOne({
      $or: [{
        _id: payload.id
      }, {
        _id: ObjectId(payload.id)
      }]
    }, (err, user) => {
      if (user) {
        delete user['pass']
        done(null, user);
      }
      else done(err, null)
    });
  } else {
    done("Invalid ID", null);
  }
})

passport.use(strategy)

export const isAuthenticated = () => passport.authenticate('jwt', { session: true })



export const signupWithEmailAndPassword = async (req, res) => {
  try {
    const { dataUser } = req.body

    await createUserByUsernameAndEmailAndPassword(dataUser)

    res.apiSend()

  } catch (error) {
    res.apiError(error)
  }
}

export function createUserByUsernameAndEmailAndPassword(dataUser, userSendedIniviteId) {
  return new Promise(async (resolve, reject) => {
    try {
      existsOrError(dataUser.name, 'Nome não informado')
      existsOrError(dataUser.email, 'Email não informado')
      existsOrError(dataUser.user, 'Username não informado')
      existsOrError(dataUser.password, 'Senha não informada')
      existsOrError(dataUser.confirmPassword, 'Confirmação de Senha inválida')
      equalsOrError(dataUser.password, dataUser.confirmPassword,
        'Senhas não conferem')

      dataUser.email = dataUser.email.trim().toLowerCase()
      dataUser.user = dataUser.user.trim().toLowerCase()
      const userFromDB = await mongodb.collection('users').findOne({
        $or: [
          {
            emails: {
              $in: [dataUser.email]
            }
          },
          {
            "profile.local.username": dataUser.user
          },
        ]
      })

      if (userFromDB) {
        let local = userFromDB.profile.local
        if (local && local.username == dataUser.user) notExistsOrError(userFromDB, 'Usuário já está em uso')
        if (userFromDB.emails.includes(dataUser.email)) {
          notExistsOrError(userFromDB, 'E-mail já está em uso')
        }
      }


      dataUser.password = encryptPassword(dataUser.password)

      delete dataUser.confirmPassword

      const insertedId = await insertNewUserForMongo(dataUser.email, 'local', {
        fullname: dataUser.name,
        avatar: "/img/useravatar.png",
        username: dataUser.user,
        password: dataUser.password,
        email: dataUser.email
      })
      resolve(insertedId)
    } catch (error) {
      reject(error)
    }
  })
}


async function integrationWithGoogle(google) {

  const profile = formatProfileGoogle(google)

  const userFromDB = await mongodb.collection('users').findOne({
    emails: {
      $in: [profile.email]
    }
  })



  if (userFromDB) {

    await mongodb.collection('users').updateOne({
      _id: ObjectId(userFromDB._id)
    }, {
        $set: {
          "profile.google": profile,
        },
        $addToSet: {
          emails: profile.email
        }
      })

    return userFromDB._id

  } else {
    return await insertNewUserForMongo(profile.email, 'google', profile)
  }
}

async function insertNewUserForMongo(email, type, profile) {
  const { insertedId } = await mongodb.collection('users').insertOne({
    newuser: true,
    points: 0,
    emails: [email],
    profile: {
      [type]: profile
    },
    pages: [],
    superadmin: false,
    admin: false,
    notifications: [],
    strikes: [],
    blacklist: false,
    invites: [],
    devices: [],
    noSuggestions: [],
    created: new Date()
  })
  return insertedId.toHexString()
}

function formatProfileGoogle({
  Eea: googleId,
  Paa: avatar,
  U3: email,
  ig: fullname,
  ofa: firstname,
  wea: lastname,
}) {
  return {
    googleId,
    avatar,
    fullname,
    firstname,
    lastname,
    email
  }
}

async function getPayloadJWT(userId, type) {
  let user = await mongodb.collection('users').findOne({
    _id: ObjectId(userId)
  })

  if (type == 'local')
    user.profile.avatar = BASE_URL + "/user/" + user._id + "/useravatar"

  const now = Math.floor(Date.now() / 1000)

  const payload = {
    id: userId,
    admin: user.admin,
    superadmin: user.superadmin,
    points: user.points,
    profile: user.profile[type],
    iat: now,
    exp: now + (60 * 60 * 24 * 3)
  }

  return {
    user: Object.assign(payload, { newuser: user.newuser, blackListPages: user.blackListPages || [] }),
    token: jwt.encode(payload, process.env.SESSION_SECRET)
  }
}
