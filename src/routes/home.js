import { getAllPages } from "../controllers/home";

export default async (router) => {
    router.route('/home')
        .get(getAllPages);
}
