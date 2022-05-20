/** @format */

import Head from "next/head";

import Question from "../../../../../components/items/Question";
import Navbar from "../../../../../components/navigation/Navbar";
import FaunaClient from "../../../../../fauna";

export default function QuestionPage({ question, author }) {
  return (
    <>
      <Head>
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
        <title>{`${author.username}'s question`}</title>
        <meta property="og:url" content="cardsmemo.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content={`${author.name}: ${question.title} || Cardsmemo`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content={`${question.bodyMD.slice(0, 40)}... Cardsmemo te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento.`}
        />
        <meta property="og:image" content={author.picture} />
      </Head>
      <Navbar title="Question" />

      <Question question={question} author={author} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { questionId } = context.query;
  const faunaClient = new FaunaClient();
  const { content, author } = await faunaClient.getSingleContentWithAuthor({
    collection: "Questions",
    id: questionId,
  });

  return {
    props: {
      question: content,
      author: author,
    },
  };
}
