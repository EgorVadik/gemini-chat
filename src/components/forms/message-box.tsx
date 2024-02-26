'use client'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { Plan } from '@prisma/client'
import { FREE_CHAR_LIMIT, PAID_CHAR_LIMIT } from '@/lib/constants'
import { cn, getModelName } from '@/lib/utils'
import { Loader2, Send } from 'lucide-react'
import { useMessageBox } from '@/hooks/use-message-box'

export const MessageBox = ({ plan }: { plan: Plan }) => {
    const {
        form,
        message,
        maxCharError,
        onSubmit,
        model,
        textAreaRef,
        loading,
    } = useMessageBox({
        plan,
    })

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className='sticky bottom-0 bg-background pb-5'
            >
                <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                        <FormItem>
                            <FormDescription
                                className={cn(
                                    'flex items-center justify-end gap-2 text-sm font-bold',
                                    {
                                        'text-red-500': maxCharError,
                                    },
                                )}
                            >
                                <FormMessage className='text-sm text-red-500' />
                                {message.length} /{' '}
                                {plan === 'FREE'
                                    ? FREE_CHAR_LIMIT
                                    : PAID_CHAR_LIMIT}
                            </FormDescription>
                            <FormControl>
                                <div className='relative'>
                                    <Textarea
                                        placeholder={`Message ${getModelName(model)}`}
                                        {...field}
                                        ref={textAreaRef}
                                        className='max-h-60 resize-none pr-14'
                                    />
                                    <Button
                                        type='submit'
                                        className='absolute right-3 top-3'
                                        size={'icon'}
                                        disabled={maxCharError || loading}
                                    >
                                        <span className='sr-only'>
                                            Send Message
                                        </span>
                                        {loading ? (
                                            <Loader2 className='animate-spin' />
                                        ) : (
                                            <Send />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
