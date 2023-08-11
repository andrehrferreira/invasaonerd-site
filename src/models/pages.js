import { mongoose } from "@dekproject/scope";

mongoose.model('Pages', new mongoose.Schema({
    ref: { type: Number, required: true, trim: true, index: true, unique: true },
    url: { type: String, required: true, trim: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    nickname: { type: String, required: false, trim: true },
    englishTitle: { type: String, required: false, trim: true },
    updated: { type: Date, default: Date.now },
    categories: [{ type: String }],
    feedbackDate: { type: Date, default: Date.now },
    removed: { type: Boolean, default: false },
}, { collection: 'pages' }));
