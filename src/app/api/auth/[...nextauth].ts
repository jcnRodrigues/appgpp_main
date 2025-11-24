"use server";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'AppGPP',
            credentials: {
                username: { label: 'Nome de Usuário', type: 'text', placeholder: 'Digite seu usuario ou e-mail' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (credentials && credentials?.username === 'admin' && credentials?.password === 'admin') {
                    return { id: '1', name: 'Admin', email: '' };
                }
                return null;

            },
        }),
    ],
});