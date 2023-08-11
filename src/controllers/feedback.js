

import { cache } from '../core/cache'
import { mongodb } from "@dekproject/scope"
import { getCategoryByText } from './category';
import { ObjectId } from 'mongodb'
import { getPageByRefMongo, getInfosPages, getFeaturedPagesMongo } from './pages';

export const getFeedbackById = async (req, res) => {
    try {
        const { feedbackId } = req.params
        const page = await mongodb.collection('revisions').findOne({
            _id: ObjectId(feedbackId)
        })
        if (page) {
            let order = { void: true }
            const category = await getCategoryByText(page.categories[0])
            if (category && category.order) order = category.order
            return res.json({
                page: await getInfosPages(page),
                order,
                timestamp: new Date()
            })
        } else {
            res.status(404).send()
        }
    } catch (error) {
        res.status(500).send({ error })
    }
}

export const getFeedbackByUserPending = async (req, res) => {
    try {
        const { ref } = req.params
        const { _id } = req.user
        const editRef = ref + '-' + _id
        const revision = await mongodb.collection('revisions').findOne({
            editRef,
            status: 'pending'
        })
        res.json(revision)
    } catch (error) {
        res.status(500).send(error)
    }
}

export const getFeedbackList = async (req, res) => {
    try {
        const pages = await mongodb.collection('revisions').find({
            status: 'pending'
        }).project({
            user: 1,
            title: 1,
            editRef: 1,
            editDate: 1
        })
            .sort({
                editDate: -1
            })
            .toArray()
        res.json(pages)
    } catch (error) {
        res.status(500).send(error)
    }
}


export const setFeedbackByIdAproved = async (req, res) => {
    try {
        const { user } = req
        const { feedbackId } = req.params
        let { aprovator, pageId } = req.body


        const date = new Date().getTime()


        // SETANDO COMO APROVADO
        await mongodb.collection('revisions')
            .updateOne({ _id: ObjectId(feedbackId), status: 'pending' },
                { $set: { status: 'aproved', feedbackDate: date } })

        let page = await mongodb.collection('revisions').findOne({ _id: ObjectId(feedbackId) })

        page.aprovator = aprovator
        if (page.pageId != pageId)
            pageId = page.pageId
        const revisionId = page._id
        delete page._id

        // SETANDO PONTUAÇÃO PRO USER
        let points = []
        page.changes.filter((change) => {
            if (points.every(({ type }) => type != change.type)) {
                points.push(change)
            }
        })
        delete page.changes
        await mongodb.collection('users')
            .updateOne({ email: page.user.email },
                { $inc: { points: points.length } },
                { upsert: true })
        //TODO notify
        // await notify.user(page.user._id, {
        //     new: true,
        //     clicked: false,
        //     href: `${settings.url}/page/${page.url}`,
        //     image: settings.url + '/assets/img/success.png',
        //     message: `A edição da página ${page.title} foi aprovada e você ganhou ${points.length} ${points.length === 1 ? 'ponto' : 'pontos'}!`,
        //     category: 'page',
        //     timestamp: new Date().getTime()
        // }, mongodb, schema, socket)
        // SETANDO LOG DE ALTERAÇÃO
        await mongodb.collection('logs')
            .updateOne({ pageId: pageId },
                {
                    $set: { title: page.title },
                    $push: {
                        logs: {
                            timestamp: date,
                            revisionId: revisionId,
                            userEditorId: page.user.id,
                            userAprovatorId: user._id,
                            action: 'Edição aprovada',
                            page
                        }
                    }
                }, { upsert: true })
        // GRAVANDO ESTATISTICAS
        if (!page.editors) page.editors = []
        page.editors.push({
            _id: page.user._id,
            editAt: date
        })
        // MANIPULANDO IMAGENS E CHAVES

        page = await deleteKeys(page)
        if (page.cover) if (page.cover.includes('/cover')) delete page.cover
        if (page.avatar) if (page.avatar.includes('/avatar')) delete page.avatar
        if (page.miniavatar) if (page.miniavatar.includes('/miniavatar')) delete page.miniavatar
        page.feedbackDate = date
        if (!page.id) page.id = date

        if (page.removed) {
            await deleteRefsPagesOtherCollections(pageId, page)
            await deleteSeachIndex(pageId, page)
            return res.send()
        }
        else {

            if(!pageId) {
                const { insertedId } = await mongodb.collection('pages').insertOne(page)
                pageId = insertedId.toHexString()
            }

            page.featuredPages = await listRelatedPages(pageId, page, page.featuredPages)

            await getFeaturedPagesMongo(page.featuredPages, false)

            if (!page.featuredPages) {
                page.featuredPages = []
            }

            await mongodb.collection('pages').updateOne(
                { _id: ObjectId(pageId) },
                { $set: page }
            )
            await saveSearchIndex(pageId, page)

            const pageActual = await getPageByRefMongo(decodeURI(page.url))

            return res.json(pageActual)
        }

    } catch (error) {
        res.status(500).send({ error })
    }
}


export const setFeedbackByIdDiscard = async (req, res) => {
    try {
        const { feedbackId } = req.params
        const date = new Date().getTime()
        // SETANDO COMO DESCARTADO
        await mongodb.collection('revisions')
            .updateOne({ _id: ObjectId(feedbackId), status: 'pending' },
                { $set: { status: 'discarded', feedbackDate: date } }
            )

        //TODO notify
        // await notify.user(page.user._id, {
        //     new: true,
        //     clicked: false,
        //     href: `${settings.url}/page/${page.url}`,
        //     image: settings.url + '/assets/img/success.png',
        //     message: `A edição da página ${page.title} foi aprovada e você ganhou ${points.length} ${points.length === 1 ? 'ponto' : 'pontos'}!`,
        //     category: 'page',
        //     timestamp: new Date().getTime()
        // }, mongodb, schema, socket)
        // SETANDO LOG DE ALTERAÇÃO

        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
}

function deleteKeys(page) {

    if (page.typesRemoved) {
        page.typesRemoved.map(type => {
            page[type] = null
        })
    }


    for (let key in page) {
        if (key === '_id' || key === 'typesRemoved' || key === 'aprovator' ||
            key === 'editDate' || key === 'editRef' ||
            key === 'status' || key === 'user' ||
            key === 'originalRef') {
            delete page[key]
        }
    }

    return page
}

export async function saveSearchIndex(pageId, page) {
    let search = page.title
    search += ', ' + page.categories.join(', ')
    if (page.nickname) search += ', ' + page.nickname
    if (page.englishTitle) search += ', ' + page.englishTitle
    if (page.youtube) if (page.youtube.url) search += ', ' + page.youtube.keywords
    await mongodb.collection('search')
        .updateOne({
            $or: [
                {
                    "url": page.url

                },
                {
                    pageId: ObjectId(pageId)
                },

                {
                    pageId: pageId
                },
            ]

        }, {
                $set: {
                    title: formatTitle(page.title, page.nickname),
                    search: search,
                    url: page.url,
                    pageId
                }
            }, {
                upsert: true
            })
}

function formatTitle(title, subtitle) {
    return title + (subtitle ? ` (${subtitle})` : '')
}


async function deleteSeachIndex(pageId, page) {
    try {
        await mongodb.collection('search').deleteOne({
            $or: [
                {
                    "url": page.url

                },
                {
                    pageId: ObjectId(pageId)
                },

                {
                    pageId: pageId
                },
            ]
        })
        await cache("page", page.url, false, false, 'delete')
        var searchPages = await cache("search-pages", false)
        searchPages = searchPages.filter(p => {
            return p.url !== page.url
        })
        await cache("search-pages", false, searchPages)
    } catch (err) { }
}

async function deleteRefsPagesOtherCollections(pageId, page) {

    await mongodb.collection('users').updateMany({
        pages: { $in: [page.ref] }
    }, {
            $pull: { pages: { $in: [page.ref] } }
        })

    await unlinkFeaturedPage(page)
    await mongodb.collection('pages').updateOne({
        _id: ObjectId(pageId)
    }, {
            $set: {
                removed: true
            }
        })
}

async function listRelatedPages(pageId, { title, url }, featuredPages = []) {

    if (pageId) {
        const page = await mongodb.collection('pages').findOne({
            _id: ObjectId(pageId)
        })
        const pagesRemoved = getFeaturesPagesRemoved(page.featuredPages, featuredPages)
        const featuredPage = {
            title,
            url,
            pageId: ObjectId(pageId)
        }
        await Promise.all(pagesRemoved.map(async ({ pageId }) => {
            await unlinkFeaturePage(pageId, featuredPage.url)
        }))
        await Promise.all(featuredPages.map(async ({ pageId, url }) => {
            await unlinkFeaturePage(pageId, featuredPage.url)
            await linkFeaturePage(pageId, featuredPage)
        }))
    }


    return featuredPages.map(({ title, url, pageId }) => ({ title, url, pageId }))

}

function getFeaturesPagesRemoved(oldPages = [], newPages = []) {
    return oldPages.filter(page => {
        return !newPages.some(p => (p.pageId.toString() == page.pageId.toString() || p.url == page.url))
    })
}

export async function unlinkFeaturedPage({ url }) {
    await mongodb.collection('pages').updateMany({
        featuredPages: {
            $elemMatch: {
                url: url
            }
        }
    }, {
            $pull: {
                "featuredPages": { url }

            }
        })
}

export async function linkFeaturePage(pageId, featuredPage) {
    await mongodb.collection('pages').updateOne({
        $or: [
            { _id: ObjectId(pageId) },
            { _id: pageId }
        ]
    }, {
            $addToSet: {
                "featuredPages": featuredPage
            }
        })
}

async function unlinkFeaturePage(pageId, url) {
    await mongodb.collection('pages').updateOne({
        _id: ObjectId(pageId)
    }, {
            $pull: {
                "featuredPages": { url }

            }
        })
}
