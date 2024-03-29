/** @format */

import { useState } from "react";
import Head from "next/head";
import { SearchIcon } from "@heroicons/react/outline";
import Title from "../components/navigation/Title";
import ItemPublication from "./../components/items/Publication";

export default function SearchPage() {
    const [textInput, setTextInput] = useState("");
    const [searchString, setSearchString] = useState("");
    const [content, setContent] = useState([]);

    const fetchSearch = async () => {
        const response = await fetch(
            `/api/publications/search?str=${textInput.trim()}`
        ).then((res) => res.json());
        setContent(response);
    };

    const handleSearch = () => {
        if (textInput.trim() !== searchString) {
            setSearchString(textInput.trim());
            fetchSearch();
        }
    };

    return (
        <>
            <Head>
                <title>Buscar en Apprendamos</title>
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
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/apprendamos/image/upload/v1652936748/app_src/ioo_swpsqz.jpg"
                />
            </Head>
            <Title>Buscar</Title>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch;
                }}
            >
                <div className="flex items-center justify-between px-6 py-2">
                    <input
                        className="dark:bg-gray-700 rounded"
                        type="text"
                        placeholder="Busca a alguien o algo"
                        onChange={(e) => {
                            setTextInput(e.target.value);
                        }}
                    />
                    <button
                        type="submit"
                        className="dark:bg-gray-700 bg-blue-700 text-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={handleSearch}
                    >
                        <SearchIcon className="h-4 w-4" />
                    </button>
                </div>
            </form>

            <div className="flex flex-col">
                {content && content.length ? (
                    content.map((item) => (
                        <ItemPublication key={item.id} {...item} />
                    ))
                ) : (
                    <div className="text-center">Busca posts</div>
                )}
            </div>
        </>
    );
}
