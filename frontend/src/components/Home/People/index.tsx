import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'
import { withBasePath } from '@/utils/urlHelper'

const People = () => {
    return (
        <section className='pt-32 pb-20' id='product'>
            <div className='container'>
                <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1'>
                    <div className='col-span-6 flex justify-center'>
                        <div className="bg-Lightsuccess bg-[url('/images/people/bg-lines.png')] bg-no-repeat bg-contain bg-right-bottom w-full h-full flex flex-col gap-10 relative py-11 px-16 rounded-2xl after:absolute after:bg-[url('/images/people/quote.png')] after:w-48 after:h-40 after:-top-16 after:right-0">
                            <div className='flex items-center gap-10'>
                                <div>
                                    <Image
                                        src={withBasePath('/images/people/team.jpg')}
                                        alt='user'
                                        width={150}
                                        height={150}
                                        className='rounded-full shadow-lg'
                                    />
                                </div>
                                <div className=''>
                                    <h3 className='text-2xl font-semibold'>Equipe</h3>
                                    <p className='text-lg text-black/55'>Fondateurs, RIMCore Tech</p>
                                </div>
                            </div>
                            <p className='font-medium text-2xl leading-180!'>
                                “Notre plateforme est une révolution pour l'enseignement supérieur
                                Mauritanien, la simplicité est notre clé.”
                            </p>
                        </div>
                    </div>
                    <div className='col-span-6 flex flex-col gap-7 lg:pl-24 mt-10 lg:mt-0 '>
                        <h2 className='text-midnight_text text-4xl sm:text-5xl font-semibold text-center lg:text-start leading-140!'>
                            Plus de 1000+ étudiants utilisent RIMCore.
                        </h2>
                        <h3 className='text-black/75 text-lg font-normal text-center lg:text-start pt-5 lg:pt-0'>
                            RIMCore connait un succes croissant aupres des etudiants mauritaniens
                            et cela n'est pas un hasard nous offrons un service fiable  et qualitatif.
                        </h3>
                        <Link
                            href={'/'}
                            scroll={false}
                            className='text-primary hover:text-blue-700 text-lg font-medium flex items-center gap-2 mx-auto lg:mx-0 pt-5 lg:pt-0'>
                            En savoir plus
                            <Icon icon='tabler:arrow-right' className='text-2xl' />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default People
