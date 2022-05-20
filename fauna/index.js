/** @format */
import { Client, query } from "faunadb";

import { CreateComment } from "./comments/create";
import { CreateContent } from "./content/create";
import { DeleteContent } from "./content/delete";
import { GetMinimalContent } from "./content/read";
import { FollowUser, LikeContent } from "./interactions/create";
import { GetContentComments } from "./comments/read";
import {
  GetViewerAuthorStats,
  GetViewerContentStats,
  GetFollowingStatus
} from "./interactions/read";
import { CreateUser } from "./user/create";
import { GetUserWithContent, GetViewer } from "./user/read";
import { UpdateViewer } from "./user/update";
import { FaunaToJSON, ParseDocType } from "./utils";
import { GetMinimalUser } from './user/read';

const {
  Ref,
  Collection,
  Paginate,
  Join, Intersection,
  Match,
  Var,
  Map,
  Get,
  Lambda,
  Index,
  If,
  Equals,
  Select,
  Let,
  Update,
  Delete,
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
    return this.client
      .query(GetViewer())
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getSinglePostWithMinimalAuthorAndComments(postId) {
    return this.client
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

  async getContentComments(ref) {
    const docType = ParseDocType(ref);
    return this.client
      .query(GetContentComments(Ref(Collection(ref.collection), ref.id), docType))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }


  async getViewerAuthorStats(username) {
    return this.client
      .query(GetViewerAuthorStats(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return {};
      });
  }

  async followUser(username) {
    return this.client
      .query(FollowUser(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getViewerContentStats(ref) {
    const docType = ParseDocType(ref);
    return this.client
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
    return this.client
      .query(LikeContent(Ref(Collection(ref.collection), ref.id), docType))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async createComment(ref, message, coins) {
    const docType = ParseDocType(ref);
    return this.client
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

  async updateComment(ref, message) {
    return this.client
      .query(
        Update(Ref(Collection(ref.collection), ref.id), { data: { message } })
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async deleteComment(ref) {
    return this.client
      .query(Delete(Ref(Collection(ref.collection), ref.id)))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getUserWithContent(username) {
    return this.client
      .query(GetUserWithContent(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async search(string) {
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    }

    let words = string.toLowerCase().match(/\b(\w+)\b/g);
    words = words.filter(onlyUnique);

    return this.client
      .query(
        Map(
          Paginate(
            Intersection(
              ...words.map((word) =>
                Match(
                  Index("search_index"),
                  word,
                )
              )
            )
          ),
          Lambda("ref",
            If(
              Equals(Collection("Users"), Select(["collection"], Var("ref"))),
              GetMinimalUser(Var("ref")),
              GetMinimalContent(Var("ref"))
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

  async getSingleContentWithAuthor(ref) {
    return this.client
      .query(
        Let(
          {
            content: Get(Ref(Collection(ref.collection), ref.id)),
            author: GetMinimalUser(Select(["data", "authorRef"], Var("content"))),
          },
          {
            content: Var("content"),
            author: Var("author"),
          }
        )
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getContent() {
    return this.client
      .query(
        Map(
          Paginate(
            Join(Match(Index("all_content")), Index("content_sorted_popularity"))
          ),
          Lambda(
            ["score", "ref", "title", "body", "created", "authorRef"],
            Let(
              {
                author: GetMinimalUser(Var("authorRef")),
              },
              {
                ref: Var("ref"),
                title: Var("title"),
                body: Var("body"),
                created: Var("created"),
                author: Var("author"),
              }
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
    return this.client
      .query(CreateContent(data, type))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async updateContent(ref, data) {
    return this.client
      .query(
        Let(
          {
            content: Update(Ref(Collection(ref.collection), ref.id), { data }),
          },
          { updated: true }
        )
      )
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async deleteContent(ref) {
    return this.client
      .query(DeleteContent(ref))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getContentByTag(tag_parsed) {
    return this.client
      .query(
        query.Map(
          Paginate(Join(Match(Index("content_by_tag"), tag_parsed), Index("content_sorted_popularity"))),
          Lambda(
            ["score", "ref", "title", "body", "created", "authorRef"],
            Let(
              {
                author: GetMinimalUser(Var("authorRef")),
              },
              {
                ref: Var("ref"),
                title: Var("title"),
                body: Var("body"),
                created: Var("created"),
                author: Var("author"),
              }
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
    return this.client
      .query(UpdateViewer(data))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async register(data) {
    return this.client
      .query(CreateUser(data))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }

  async getFollowingStatus(username) {
    return this.client
      .query(GetFollowingStatus(username))
      .then((res) => FaunaToJSON(res))
      .catch((error) => {
        console.log("error", error);
        return null;
      });
  }
}
