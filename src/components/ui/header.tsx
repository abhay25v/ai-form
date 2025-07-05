import React from 'react'
import { auth, signIn, signOut } from "@/auth"
import { Button } from './button'
import Image from 'next/image'
import Link from 'next/link'
import { sign } from 'crypto'



type Props = {}

function SignOut() {
    return (
        <form action={
            async () => {
                'use server';
                await signOut()
            }
        }>
            <Button type="submit">Sign Out</Button>
        </form>
    )
}

const Header = async (props: Props) => {
    const session = await auth();
    // console.log(session);
    return (
        <header className="border bottom-1">
            <nav className='flex flex-wrap items-center justify-between mx-auto max-w-screen-xl p-4'>
                <div>
                    <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                        AI Form Builder
                    </Link>
                </div>
                {
                    session?.user ? (
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-4'>
                                <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                    Home
                                </Link>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                            </div>
                            <div className='flex items-center gap-2'>
                                {session.user.name && session.user.image && (
                                    <Image 
                                        src={session.user.image} 
                                        alt={session.user.name} 
                                        width={32} 
                                        height={32} 
                                        className='rounded-full' 
                                    />
                                )}
                                <SignOut />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth/signin">
                                <Button variant="outline">Sign In</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )
                }
            </nav>
        </header>
    )
}
export default Header