/** @format */

/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

import FaunaClient from "../../../../../fauna";
import PostForm from "../../../../../components/forms/PostForm";

export default function EditPostPage({ post, author }) {
	const { user, isLoading } = useUser();
	if (isLoading) return <div>Cargando...</div>;

	if ((!isLoading && !user) || user?.username !== author.username) {
		const router = useRouter();
		router.back();

		return <div>Cargando...</div>;
	}

	return (
		<div>
			<Head>
				<title>Editar Post</title>
				<link
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css'
					integrity='sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB'
					crossorigin='anonymous'
				/>
				<script
					defer
					src='https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js'
					integrity='sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p'
					crossorigin='anonymous'></script>
			</Head>

			<h1 className='text-gray-800  text-2xl mb-4'>Editar un post</h1>
			<PostForm post={post} author={author} />
		</div>
	);
}

export async function getServerSideProps(context) {
	const { postId } = context.query;
	const faunaClient = new FaunaClient();
	const res = await faunaClient.getSingleContentWithAuthor(
		{
			collection: "Posts",
			id: postId,
		},
		0
	);

	return {
		props: {
			post: res.content,
			author: res.author,
		},
	};
}