"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Hero from '@/components/Home/Hero'
import People from '@/components/Home/People'
import Features from '@/components/Home/Features'
import Utilisateur from '@/app/utilisateur/page'
import { Metadata } from 'next'

const metadata: Metadata = {
  title: 'Paidin',
}


export default function Home() {

  const [user, setUser] = useState<{ nom: string; prenom: string } | null>(null); // test1
   useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

  return (
    <>
       {user? 
       
       (<main>
            <Utilisateur />
       </main>) : 
       
       (<main>
            <Hero />
            <People />
            <Features />
       </main>)};
    </>
  )
}