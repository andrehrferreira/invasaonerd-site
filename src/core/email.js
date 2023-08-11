import nodemailer from 'nodemailer'
import schema from '../core/schema'

export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: schema.email.user,
        pass: schema.email.pass
    }
})