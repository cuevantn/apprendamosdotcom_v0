/** @format */
import Head from "next/head";
import FaunaClient from "../../../fauna";
import { MDParsed } from "../../../components/Markdown";
import Publication404 from "../../../components/errors/Publication404";
import PublicationOptionsButton from "./../../../components/buttons/PublicationOptions";
import Title from "./../../../components/navigation/Title";
import BasicAuthorCard from "./../../../components/items/AuthorCard/Basic";
import FollowButton from "../../../components/buttons/Follow";
import { PublicationInteractions } from "../../../components/PublicationInteractions";

const PublicationPage = ({ publication }) => {
    return (
        <>
            <Head>
                <title>{`@${
                    publication.author.nickname
                }: ${publication.body.slice(2, 20)}... || Apprendamos`}</title>
                <meta property="og:url" content="apprendamos.com" />
                <meta property="og:type" content="website" />
                <meta property="fb:app_id" content="328834189100104" />
                <meta
                    property="og:title"
                    content={`${publication.author.name}: ${publication.body} || Apprendamos`}
                />
                <meta name="twitter:card" content="summary" />
                <meta
                    property="og:description"
                    content={`${publication.body}`}
                />
                <meta
                    property="og:image"
                    content={publication.author.picture}
                />
            </Head>
            <Title>Publicación</Title>
            <div className="p-2 border-b hover:bg-gray-50">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2 items-center">
                        <BasicAuthorCard {...publication.author} />
                        <FollowButton nickname={publication.author.nickname} />
                    </div>

                    <div className="flex items-center">
                        <PublicationOptionsButton
                            publicationId={publication.id}
                            createdAt={publication.createdAt}
                        />
                    </div>
                </div>
                <MDParsed body={publication.body} />
                <PublicationInteractions id={publication.id} />
            </div>
        </>
    );
};

const getServerSideProps = async ({ query, resolvedUrl }) => {
    try {
        const { id } = query;
        const client = new FaunaClient();
        const publication = await client.getSinglePublication(id);
        return {
            props: {
                publication: {
                    ...publication,
                    id,
                },
            },
        };
    } catch (error) {
        if (error.requestResult.statusCode === 400) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/400?fromUrl=" + resolvedUrl,
                },
                props: {},
            };
        }
        return { props: { errorCode: error.requestResult.statusCode } };
    }
};

const PublicationPageHandler = ({ publication, errorCode }) => {
    if (errorCode === 404) {
        return <Publication404 />;
    }
    return <PublicationPage publication={publication} />;
};

export default PublicationPageHandler;
export { getServerSideProps };
