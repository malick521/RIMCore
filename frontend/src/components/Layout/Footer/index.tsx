"use client"
import { getYear } from 'date-fns'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'


interface links {
    link: string
}

const links: links[] = [
    {
        link: 'Services',
    },
    {
        link: 'Fonctionnalités',
    },
]

const links_student: links[] = [
    {
        link: 'Profile',
    },
    {
        link: 'Achetez Ticket',
    },
    {
        link: 'Contact',
    },
]

const footer = () => {
    const [user, setUser] = useState<{ nom: string; prenom: string } | null>(null); // test1
       useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className='bg-midnight_text p-4'>
            <h4 className='text-center md:font-normal text-white opacity-60'>
                &copy; 2026 All rights reserved by RIMCore Tech
            </h4>
        </div>
    )
}

export default footer
