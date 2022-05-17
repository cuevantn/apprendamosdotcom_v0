/** @format */

import Head from "next/head";
import { useRouter } from "next/router";

import Content from "../../components/lists/Content";
import FaunaClient from "../../fauna";

export default function TagPage({ content }) {
  const router = useRouter();
  const { tag } = router.query;

  return (
    <>
      <Head>
        <title>#{tag} posts & flashquizzes</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css"
          integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB"
          crossOrigin="anonymous"
        />
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js"
          integrity="sha384-0fdwu/T/EQMsQlrHCCHoH10pkPLlKA1jL5dFyUOvB3lfeT2540/2g6YgSi2BL14p"
          crossOrigin="anonymous"
        />
      </Head>
      <h1 className="mb-2 text-center text-2xl font-extrabold">
        Contenido con #{tag}
      </h1>
      {content && content.length > 0 ? (
        <Content content={content} minimal />
      ) : (
        <div>
          <h1>Sin contenido :(</h1>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { tag } = context.params;

    const client = new FaunaClient();

    const tag_parsed = tag.toLowerCase();

    const content = await client.getContentByTag(tag_parsed);

    return {
      props: {
        content,
      },
    };
  } catch (error) {
    return { props: { errorCode: 500, errorMessage: error.message } };
  }
}
