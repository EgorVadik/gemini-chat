import { LandingNav } from '@/components/nav/landing-nav'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { FEATURES, PRICING } from '@/lib/constants'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Home() {
    return (
        <>
            <div className='fixed top-0 z-[-2] h-screen w-screen bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]' />
            <div className='container'>
                <LandingNav />
                <main className='min-h-screen py-10'>
                    <section id='home' className='space-y-4 py-44 text-center'>
                        <h1 className='bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-6xl font-bold text-transparent'>
                            Gemini Chat
                        </h1>
                        <p className='mx-auto max-w-lg text-balance text-2xl'>
                            Gemini Chat is a platform for interacting with
                            different AI language models, including GPT-3.5,
                            GPT-4, and Gemini.
                        </p>
                        <Link
                            href={'/sign-up'}
                            draggable={false}
                            className={buttonVariants({
                                className:
                                    'relative mx-auto block h-fit w-fit rounded-full bg-gradient-to-r from-primary to-primary-foreground px-10 py-3 text-lg font-bold text-white ring-primary hover:ring-2',
                                variant: 'default',
                            })}
                        >
                            Get Started
                        </Link>
                    </section>

                    <section
                        id='features'
                        className='grid grid-cols-1 gap-4 px-4 lg:grid-cols-2'
                    >
                        {FEATURES.map((feature, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className='text-center text-3xl font-bold text-primary'>
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className='mx-auto max-w-sm text-balance text-center text-lg'>
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section id='pricing'>
                        <h2 className='mt-20 text-center text-5xl font-bold text-primary'>
                            Choose the perfect plan
                        </h2>
                        <p className='mx-auto mt-4 max-w-lg text-balance text-center text-2xl'>
                            Choose the plan that best fits your needs. Get
                            started for free, then upgrade to a premium plan as
                            your demands grow.
                        </p>

                        <div className='grid grid-cols-1 gap-4 px-4 py-10 lg:grid-cols-3'>
                            {PRICING.map((plan, index) => (
                                <Card
                                    key={index}
                                    className={cn(
                                        'lg:mx-auto lg:max-w-xs',
                                        plan.title === 'Pro' && 'lg:scale-110',
                                    )}
                                >
                                    <CardHeader>
                                        <CardTitle className='text-center text-3xl font-bold text-primary'>
                                            {plan.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className='mx-auto max-w-sm text-balance text-center text-lg'>
                                            <span className='text-5xl font-bold'>
                                                {plan.price === 0
                                                    ? 'Free'
                                                    : `$${plan.price}`}
                                            </span>
                                            {plan.price === 0 ? null : (
                                                <span>/month</span>
                                            )}
                                        </CardDescription>
                                        <ul className='mt-4 space-y-2 text-balance text-sm'>
                                            {plan.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className='flex items-center gap-2'
                                                    >
                                                        <Check />
                                                        {feature}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Link
                                            href={'/sign-up'}
                                            draggable={false}
                                            className={buttonVariants({
                                                className:
                                                    'relative mx-auto block h-fit w-fit rounded-full bg-gradient-to-r from-primary to-primary-foreground px-10 py-3 text-lg font-bold text-white ring-primary hover:ring-2',
                                                variant:
                                                    plan.title === 'Pro'
                                                        ? 'default'
                                                        : 'outline',
                                            })}
                                        >
                                            {plan.title === 'Pro'
                                                ? 'Get Started'
                                                : 'Upgrade'}
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}
