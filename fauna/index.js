/** @format */
import { Client, query } from "faunadb";

import { GetViewer, GetUserWithContent } from "./user/read";
import {
	GetViewerContentStats,
	GetViewerAuthorStats,
} from "./interactions/read";

import { UpdateViewer } from "./user/update";
import { CreateUser } from "./user/create";

import { LikeContent, FollowUser } from "./interactions/create";
import { GetContentWithAuthor } from "./content/read";
import { CreateComment } from "./comment/create";
import { CreateContent } from "./content/create";

import { FaunaToJSON, ParseDocType } from "./utils";

const {
	Ref,
	Collection,
	Paginate,
	Join,
	Match,
	Var,
	Lambda,
	Index,
	If,
	Equals,
	Select,
} = query;

export default class FaunaClient {
	constructor(secret) {
		if (secret) {
			this.client = new Client({
				secret,
				domain: process.env.FAUNA_DOMAIN,
			});
		} else {
			this.client = new Client({
				secret: process.env.FAUNA_SECRET,
				domain: process.env.FAUNA_DOMAIN,
			});
		}
	}
	async getViewer() {
		return await this.client
			.query(GetViewer())
			.then((res) => {
				const x = FaunaToJSON(res);
				console.log("x", x);
				return x;
			})
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getSinglePostWithMinimalAuthorAndComments(postId) {
		return await this.client
			.query(
				GetPostWithMinimalAuthorAndComments(Ref(Collection("Posts"), postId))
			)
			.then((res) => {
				const doc = FaunaToJSON(res);
				return { ...doc.post, author: doc.author, comments: doc.comments };
			})
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getViewerAuthorStats(username) {
		return await this.client
			.query(GetViewerAuthorStats(username))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return {};
			});
	}

	async followUser(username) {
		return await this.client
			.query(FollowUser(username))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getViewerContentStats(ref) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(
				GetViewerContentStats(Ref(Collection(ref.collection), ref.id), docType)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async likeContent(ref) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(LikeContent(Ref(Collection(ref.collection), ref.id), docType))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}
	async createComment(ref, message, coins) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(
				CreateComment(
					Ref(Collection(ref.collection), ref.id),
					docType,
					message,
					coins
				)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getUserWithContent(username) {
		return await this.client
			.query(GetUserWithContent(username))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getSingleContent(ref) {
		const docType = ParseDocType(ref);
		return await this.client
			.query(
				GetContentWithAuthor(
					Ref(Collection(ref.collection), ref.id),
					docType,
					30
				)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getContent(username) {
		return await this.client
			.query(
				query.Map(
					Paginate(
						Join(Match("all_content"), Index("content_sorted_popularity"))
					),
					Lambda(
						["score", "ref"],
						If(
							Equals(Select(["collection", "id"], Var("ref")), "Posts"),
							GetContentWithAuthor(Var("ref"), "post", 3, username),
							GetContentWithAuthor(Var("ref"), "flashquiz", 3, username)
						)
					)
				)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async createContent(data, type) {
		if (type === "post") {
			if (data.bodyHTML === undefined || data.bodyHTML === "") {
				return null;
			}
		}

		return await this.client
			.query(CreateContent(data, type))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async getContentByTag(tag_parsed) {
		return await this.client
			.query(
				query.Map(
					Paginate(Match(Index("content_by_tag"), tag_parsed)),
					Lambda(
						["score", "ref"],
						If(
							Equals(Select(["collection", "id"], Var("ref")), "Posts"),
							GetContentWithAuthor(Var("ref"), "post", 3),
							GetContentWithAuthor(Var("ref"), "flashquiz", 3)
						)
					)
				)
			)
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async updateViewer(data) {
		return await this.client
			.query(UpdateViewer(data))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}

	async register(data) {
		return await this.client
			.query(CreateUser(data))
			.then((res) => FaunaToJSON(res))
			.catch((error) => {
				console.log("error", error);
				return null;
			});
	}
}