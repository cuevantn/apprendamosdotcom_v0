import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

import FaunaClient from "fauna";

const SinglePublicationDraftAPI = async (req, res) => {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const client = new FaunaClient(accessToken);

        if (req.method === "POST") {
            const { body } = req.body;
            const response = await client.createDraft(body);
            res.status(200).json(response);
        } else if (req.method === "GET") {
            const afterId = req.query && req.query.afterId;
            const response = await client.getViewerPublicationDrafts(afterId);
            res.status(200).json(response);
        } else {
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(error.requestResult?.statusCode || 500).json(
            error.requestResult?.responseContent?.errors || error
        );
    }
};

export default withApiAuthRequired(SinglePublicationDraftAPI);
