import { Menu, Transition } from "@headlessui/react";
import { Fragment, forwardRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import moment from "moment";

import CopyLinkModal from "../modals/CopyLink";
import DeleteContentModal from "../modals/DeleteContent";

// eslint-disable-next-line react/display-name
const MyLink = forwardRef((props, ref) => {
    let { href, children, ...rest } = props;
    return (
        <Link href={href}>
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    );
});

export default function PublicationOptionsButton({
    publication_id,
    created_at,
}) {
    const [copyLinkModalOpen, setCopyLinkModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(
            `https://apprendamos.com/p/${publication_id}`
        );
        setCopyLinkModalOpen(true);
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    return (
        <>
            <DeleteContentModal
                isOpen={deleteModalOpen}
                setIsOpen={setDeleteModalOpen}
                publicationId={publication_id}
            />
            <CopyLinkModal
                isOpen={copyLinkModalOpen}
                setIsOpen={setCopyLinkModalOpen}
            />
            <div className="w-32 text-right">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex w-full justify-center rounded-md py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                            <p className="text-sm dark:text-gray-300">
                                {moment(created_at).fromNow()}
                            </p>
                            <ChevronDownIcon
                                className="h-5 w-5 text-blue-600 hover:text-blue-300"
                                aria-hidden="true"
                            />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="z-50 absolute right-0 mt-2  mr-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    {({ active }) => (
                                        <MyLink href={`/p/${publication_id}`}>
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-blue-200 text-blue-500"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {active ? (
                                                    <EditActiveIcon
                                                        className="mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <EditInactiveIcon
                                                        className="mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                Ver más
                                            </button>
                                        </MyLink>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleCopyLink}
                                            className={`${
                                                active
                                                    ? "bg-blue-200 text-blue-500"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            {active ? (
                                                <ArchiveActiveIcon
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <ArchiveInactiveIcon
                                                    className="mr-2 h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            )}
                                            Copiar enlace
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <MyLink
                                            href={`/p/${publication_id}/update`}
                                        >
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-blue-200 text-blue-500"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {active ? (
                                                    <EditActiveIcon
                                                        className="mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <EditInactiveIcon
                                                        className="mr-2 h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                Editar
                                            </button>
                                        </MyLink>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleDelete}
                                            className={`${
                                                active
                                                    ? "bg-red-300 text-red-500"
                                                    : "text-red-500"
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            {active ? (
                                                <DeleteActiveIcon
                                                    className="mr-2 h-5 w-5 "
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <DeleteInactiveIcon
                                                    className="mr-2 h-5 w-5 "
                                                    aria-hidden="true"
                                                />
                                            )}
                                            Eliminar
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    );
}

function EditInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                stroke="#3B82F6"
                strokeWidth="2"
            />
        </svg>
    );
}

function EditActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#BFDBFE"
                stroke="#3B82F6"
                strokeWidth="2"
            />
        </svg>
    );
}

function ArchiveInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                stroke="#3B82F6"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                stroke="#3B82F6"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#3B82F6" strokeWidth="2" />
        </svg>
    );
}

function ArchiveActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                fill="#BFDBFE"
                stroke="#3B82F6"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                fill="#BFDBFE"
                stroke="#3B82F6"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#3B82F6" strokeWidth="2" />
        </svg>
    );
}

function DeleteInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                stroke="#f87171"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#f87171" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#f87171" strokeWidth="2" />
        </svg>
    );
}

function DeleteActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#fca5a5"
                stroke="#f87171"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#f87171" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#f87171" strokeWidth="2" />
        </svg>
    );
}
