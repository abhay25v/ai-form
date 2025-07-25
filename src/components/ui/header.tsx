'use client';
import React from 'react'
import { Button } from './button'
import Image from 'next/image'
import Link from 'next/link'
import type { Session } from "next-auth";

type Props = {
    session: Session | null;
};

export const navbarLogoId = "navbar-logo";

function Header({ session }: Props) {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
            <nav className='flex flex-wrap items-center justify-between mx-auto max-w-screen-xl px-4 py-4'>
                <div>
                    <Link href="/" className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-teal-700 transition-all">
                        <Image
                            id={navbarLogoId}
                            src="/fav.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto inline-block"
                            priority
                        />
                        AI Form Builder
                    </Link>
                </div>
                {
                    session?.user ? (
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-6'>
                                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50">
                                    Home
                                </Link>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-teal-50">
                                    Dashboard
                                </Link>
                            </div>
                            <div className='flex items-center gap-3'>
                                {session.user.name && session.user.image && (
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name}
                                            width={32}
                                            height={32}
                                            className='rounded-full border-2 border-emerald-200'
                                        />
                                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                            {session.user.name}
                                        </span>
                                    </div>
                                )}
                                <form action="/api/auth/signout" method="post">
                                    <Button type="submit" variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 hover:text-red-600">
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/auth/signin">
                                <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )
                }
            </nav>
        </header>
    )
}
export default Header;