import { stripe } from '@/lib/stripe'
import { prisma } from '@/server/db'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    } catch (error) {
        return NextResponse.json(
            {
                menubar: 'Invalid signature',
            },
            {
                status: 400,
            },
        )
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
        )

        const userId = session.metadata?.userId
        if (!userId)
            return NextResponse.json(
                {
                    message: 'Invalid user id',
                },
                {
                    status: 400,
                },
            )

        const subscriptionData = {
            stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000,
            ),
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodStart: new Date(
                subscription.current_period_start * 1000,
            ),
        }

        try {
            await prisma.userSubscription.upsert({
                where: {
                    userId,
                },
                update: {
                    ...subscriptionData,
                },
                create: {
                    userId,
                    ...subscriptionData,
                },
            })
        } catch (error) {
            return NextResponse.json(
                {
                    message: 'Failed to update subscription',
                },
                {
                    status: 500,
                },
            )
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
        )

        await prisma.userSubscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000,
                ),
            },
        })
    }

    revalidateTag('user-plan')
    return NextResponse.json(
        {
            message: 'Success',
        },
        {
            status: 200,
        },
    )
}
