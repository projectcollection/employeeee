'use client'
import Image from 'next/image'

export default async function Home() {
    //seems this is a server component, which will fetch from the server.
    //cors doesn't affect server fetches
    let data: any[] = (await (await fetch('http://localhost:3000/products', {cache: 'no-store'})).json()).products;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {data.map((prod) => {
                return (<p key={prod.id}>{prod.name}</p>)
            })}
        </main>
    )
}
