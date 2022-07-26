/** @format */

import FaunaClient from "fauna";

const AuthorFollowersAPI = async (req, res) => {
    try {
        const client = new FaunaClient();

        const { username } = req.query;
        const afterId = req.query && req.query.afterId;

        const content = await client.getAuthorFollowing(username, afterId);

        res.status(200).json(content);
    } catch (error) {
        console.log("errorAPI", error);
        res.status(500).json({
            errorCode: 500,
            errorMessage: error.message,
        });
    }
};

export default AuthorFollowersAPI;
