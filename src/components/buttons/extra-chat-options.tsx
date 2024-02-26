'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteChat } from '../dialogs/delete-chat'
import { RenameChat } from '../dialogs/rename-chat'

export const ExtraChatOptions = ({
    children,
    chatId,
    previousTitle,
}: {
    children: React.ReactNode
    chatId: string
    previousTitle: string
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <RenameChat chatId={chatId} previousTitle={previousTitle}>
                        Rename
                    </RenameChat>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <DeleteChat chatId={chatId}>Delete</DeleteChat>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
