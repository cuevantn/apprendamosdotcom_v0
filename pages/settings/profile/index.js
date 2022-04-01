/** @format */

import Head from "next/head";

import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";

import ProfileForm from "../../../components/forms/ProfileForm";

export default function Account({ user }) {
	return (
		<div>
			<Head>
				<title>Edita tu Perfil</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-lg mx-auto'>
				<h1 className=' text-2xl mb-4'>Edita tu Perfil</h1>
				<ProfileForm profile={user.profile} />
			</main>
		</div>
	);
}

export const getServerSideProps = withPageAuthRequired({
	redirectTo: "/",
});