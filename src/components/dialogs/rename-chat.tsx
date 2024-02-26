import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { RenameSchema, renameSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { renameChat } from '@/actions/user'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type RenameChatProps = {
    children: React.ReactNode
    chatId: string
    previousTitle: string
}

export const RenameChat = ({
    children,
    chatId,
    previousTitle,
}: RenameChatProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const form = useForm<RenameSchema>({
        resolver: zodResolver(renameSchema),
        defaultValues: {
            title: previousTitle,
        },
    })

    const onSubmit = async (data: RenameSchema) => {
        setLoading(true)
        const { error, success } = await renameChat(chatId, data.title)
        if (!success) {
            toast.error(error)
        }
        setLoading(false)
    }

    return (
        <Popover open={isOpen}>
            <PopoverTrigger onClick={() => setIsOpen(!isOpen)}>
                {children}
            </PopoverTrigger>
            <PopoverContent
                onPointerMove={(e) => e.preventDefault()}
                onPointerOver={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                onPointerEnter={(e) => e.preventDefault()}
                onPointerDownOutside={() => setIsOpen(false)}
                onEscapeKeyDown={() => setIsOpen(false)}
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    form.handleSubmit(
                                                        onSubmit,
                                                    )()
                                                }

                                                if (e.key === ' ') {
                                                    e.stopPropagation()
                                                }
                                            }}
                                            placeholder={
                                                previousTitle === null
                                                    ? 'Untitled'
                                                    : previousTitle
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-end justify-end'>
                            <Button
                                type='submit'
                                disabled={loading}
                                className='flex items-center justify-center gap-2'
                            >
                                {loading && (
                                    <Loader2 className='animate-spin' />
                                )}
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}
