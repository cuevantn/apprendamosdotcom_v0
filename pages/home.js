/** @format */

import { useState, useEffect } from "react";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Head from "next/head";
import useSWRInfinite from 'swr/infinite'
import InfiniteScroll from 'react-infinite-scroll-component';

import { PublicationPartialView } from './../components/items/PublicationPartialView';

const HomePage = () => {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.data) return null
    if (pageIndex === 0) return '/api/publications'
    return `/api/publications?afterId=${previousPageData.afterId}`
  }
  const { data, size, setSize } = useSWRInfinite(getKey)

  let contentSize = 0;
  data?.forEach(page => {
    contentSize += page?.data?.length
  });

  return (
    <>
      <Head>
        <title>Apprendamos || Flashcards & articles</title>
        <meta property="og:url" content="apprendamos.com" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="328834189100104" />
        <meta
          property="og:title"
          content="Apprendamos: Tu red de conocimiento"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Apprendamos te permite compartir publicaciones y flashcards con los demás usuarios de la red. Regístrate y empieza a crear y compartir tu propia red de conocimiento."
        />
        <meta property="og:image" content="https://res.cloudinary.com/apprendamos/image/upload/v1652936748/app_src/ioo_swpsqz.jpg" />
      </Head>

      <h1 className='text-2xl font-extrabold hover:text-blue-700 cursor-default'>Inicio</h1>

      <InfiniteScroll
        scrollableTarget="main"
        dataLength={contentSize}
        next={() => setSize(size + 1)}
        hasMore={Boolean(data?.at(-1)?.afterId)}
        loader={<h1>Loading...</h1>}
        endMessage={
          <p className="text-center">
            <b>Yay! You have seen it all :D</b>
          </p>
        }
      >
        {
          data?.map(page => page.data?.map(item => item && <PublicationPartialView key={item.id} {...item} />))
        }
      </InfiniteScroll>
    </>
  );
}

export default HomePage;
export const getServerSideProps = withPageAuthRequired();