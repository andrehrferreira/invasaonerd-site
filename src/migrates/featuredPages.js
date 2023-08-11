
import { mongodb } from "@dekproject/scope"


export async function getFeaturedPagesAll(req, res) {
    try {
        const pages = await mongodb.collection('pages').find({
            featuredPages: { $exists: true }
        }).project({
            featuredPages: 1,
            title: 1,
            url: 1,
        })
            .toArray()
        await Promise.all(pages.map(async ({ title, url, _id: pageId, featuredPages }) => {
            const featuredPage = {
                title,
                url,
                pageId
            }
            if (Array.isArray(featuredPages)) {
                await Promise.all(featuredPages.map(async featured => {
                    if (!featured) return
                    try {
                        await unlinkFeaturePage(featured.url, url)
                        await linkFeaturePage(featured.url, featuredPage)
                    } catch (err) {
                        console.log(err.message)
                    }
                }))
            }
        }))

        await mongodb.collection('pages').updateMany(
            {
                $and: [
                    { featuredPages: { $exists: true } }, { featuredPages: null }
                ]
            },
            {
                $set: {
                    featuredPages: []
                }
            })

        res.apiSend('Finished')
    } catch (err) {
        res.apiError(err.message)
    }
}

async function linkFeaturePage(url, featuredPage) {
    await mongodb.collection('pages').updateOne({
        url: url
    }, {
            $addToSet: {
                "featuredPages": featuredPage
            }
        })
}


async function unlinkFeaturePage(pageUrl, url) {

    return await mongodb.collection('pages').updateOne({
        url: pageUrl
    }, {
            $pull: {
                "featuredPages": { url }

            }
        })

}
export async function getAllSearch(req, res) {
    try {
        const pages = await mongodb.collection('search').find({
            pageId: { $exists: false }
        })
            .toArray()
        await Promise.all(pages.map(async ({ ref, _id: searchId, url }) => {
            const page = await mongodb.collection('pages').findOne({ $or: [{ ref }, { url }] }, { _id: 1 })
            if (page) {
                await mongodb.collection('search').findOneAndUpdate({ _id: searchId }, {
                    $set: {
                        pageId: page._id
                    }
                })
            } else {
                await mongodb.collection('search').deleteOne({ _id: searchId })
            }
        }))
        res.apiSend()
    } catch (err) {
        res.apiError(err.message)
    }

}