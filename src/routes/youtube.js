import { getYoutubeChannel, getYoutubeVideos, getYoutubeChannelByType } from '../controllers/youtube'

export default async (router) => {
    router.route('/youtube/channel')
        .get(getYoutubeChannel);

    router.route('/youtube/channel/type')
        .get(getYoutubeChannelByType);

    router.route('/youtube/videos')
        .get(getYoutubeVideos);
}
