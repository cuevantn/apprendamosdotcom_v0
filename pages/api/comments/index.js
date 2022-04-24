/** @format */

import FaunaClient from "../../../fauna";

export default async function getComments(req, res) {
	try {
		const client = new FaunaClient();

		const { ref } = req.body;
		console.log("ref", ref);
		const comments = await client.getComments(ref);

		res.status(200).json(comments);
	} catch (error) {
		console.log("error", error);
		res.status(error.status || 500).json(error);
	}
}
