/** @format */
import moment from "moment";
import Link from "next/link";

import BasicAuthorCard from './BasicAuthorCard';
import FullAuthorCard from './FullAuthorCard';
import Interactions from "../Interactions";
import Tags from "../Tags";

export default function Question({
  question,
  author,
  minimal,
}) {
  if (minimal) {
    return (
      <article className="space-y-2 py-2 px-6">
        <div className="flex justify-between items-center">
          <BasicAuthorCard author={author} />
          <button type="button" className="h-6 w-24 rounded text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600">
            Pregunta
          </button>
        </div>
        <Link href={`/@/${author.username}/questions/${question.ref.id}`}>
          <a>
            <h1 className="text-2xl font-bold">{question.title}</h1>
          </a>
        </Link>
        <div
          className="prose prose-sm line-clamp-2 prose-img:mx-auto prose-img:rounded-lg dark:prose-invert"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: question.body.slice(0, 250) }}
        />
        <Link href={`/@/${author.username}/questions/${question.ref.id}`}>
          <a>
            <p className="text-right text-sm dark:text-gray-300">
              Hace {moment(question.created).fromNow()}
            </p>
          </a>
        </Link>
      </article>
    );
  }
  return (
    <article className="space-y-2 py-2 px-6">
      <FullAuthorCard author={author} />
      <h1 className="text-3xl font-black">{question.title}</h1>
      <div
        className="prose prose-img:mx-auto prose-img:rounded-lg dark:prose-invert text-ellipsis overflow-hidden"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: question.body }}
      />
      <div className="text-right text-sm dark:text-gray-300">
        <p>Creado el {moment(question.created).format("LL")}</p>
        <p>Editado por última vez el {moment(question.ts / 1000).format("LL")}</p>
      </div>
      <Tags tags={question.tags} />
      <Interactions
        contentRef={question.ref}
        startStats={question.stats}
      />
    </article>
  );
}