import { mongoose } from "@dekproject/scope";

mongoose.model('Users', new mongoose.Schema({
    newuser: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    emails: [{ type: String }],
    profile: { type: Object },
    superadmin: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    noSuggestions: { type: Boolean, default: false },
    blacklist: { type: Boolean, default: false },
    notifications: [{ type: Object }],
    devices: [{ type: String }],
    created: { type: Date, default: Date.now },
}, { collection: 'users' }));

