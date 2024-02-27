import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '../ui/button'
import { deleteChat } from '@/actions/user'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const DeleteChat = ({
    children,
    chatId,
}: {
    children: React.ReactNode
    chatId: string
}) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <AlertDialog>
            <AlertDialogTrigger className='w-full text-start'>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the chat and all of its messages.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            setLoading(true)
                            const { error, success } = await deleteChat(chatId)
                            if (!success) {
                                toast.error(error)
                            }

                            setLoading(false)
                            router.replace('/chat')
                        }}
                        className={buttonVariants({
                            variant: 'destructive',
                            className: 'flex items-center justify-center gap-2',
                        })}
                    >
                        {loading && <Loader2 className='animate-spin' />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
