import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import {
    BookmarkIcon,
    SearchIcon,
    TrendingUpIcon,
    PencilAltIcon,
    HomeIcon,
    BellIcon,
    MailIcon,
    CogIcon,
} from "@heroicons/react/outline";

const MobileNavbarAuth = ({ user }) => (
    <nav
        className="
        flex
        sm:hidden items-center justify-center
		space-x-6 py-2
        font-bold text-xl
        bottom-0 sticky bg-gray-50 border-t"
    >
        <Link href="/">
            <a>
                <div className="relative h-5 w-5">
                    <Image
                        src="/logo.svg"
                        alt="Picture of the author"
                        layout="fill"
                        objectFit="fill"
                        quality={10}
                        priority
                    />
                </div>
            </a>
        </Link>
        <Link href="/home">
            <a>
                <div className="flex items-center">
                    <HomeIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/search">
            <a>
                <div className="flex items-center">
                    <SearchIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/draft">
            <a>
                <div className="flex items-center">
                    <PencilAltIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/trending">
            <a>
                <div className="flex items-center">
                    <TrendingUpIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/saved">
            <a>
                <div className="flex items-center">
                    <BookmarkIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/notifications">
            <a>
                <div className="flex items-center">
                    <BellIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/settings/profile">
            <a>
                <div className="flex items-center">
                    <CogIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href={`/@${user.nickname}`}>
            <a>
                <div className="xl:hidden relative h-6 w-6 rounded-full overflow-hidden border cursor-pointer">
                    <Image
                        src={user.picture}
                        alt="Picture of the author"
                        layout="fill"
                        objectFit="fill"
                        quality={10}
                    />
                </div>
            </a>
        </Link>
    </nav>
);

const MobileNavbarNoAuth = () => (
    <nav
        className="
        flex
        sm:hidden items-center justify-center
		space-x-6 py-2
        font-bold text-xl
        bottom-0 sticky bg-gray-50 border-t"
    >
        <div className="hidden xl:block">
            <Link href="/">
                <a>
                    <div className="flex items-center">
                        <span className="font-bold hover:text-blue-700">
                            app
                        </span>
                    </div>
                </a>
            </Link>
        </div>

        <Link href="/search">
            <a>
                <div className="flex items-center">
                    <SearchIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
        <Link href="/trending">
            <a>
                <div className="flex items-center">
                    <TrendingUpIcon className="h-6 w-6" />
                </div>
            </a>
        </Link>
    </nav>
);

const MobileNavbar = () => {
    const { user } = useUser();

    if (user && user?.nickname) return <MobileNavbarAuth user={user} />;
    return <MobileNavbarNoAuth />;
};

export default MobileNavbar;
