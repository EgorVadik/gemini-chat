'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { GENERATIONS } from '@/lib/constants'
import { useAtom } from 'jotai'
import { generationAtom, modelAtom } from '@/atoms'
import type { Generation } from '@/types'
import { useRouter } from 'next/navigation'

export const GenerationsCombobox = () => {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = useAtom(generationAtom)
    const [model, setModel] = useAtom(modelAtom)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-fit justify-between sm:w-[200px]'
                >
                    {value
                        ? GENERATIONS.find(
                              (generation) => generation.value === value,
                          )?.label
                        : 'Select generation...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search generation...' />
                    <CommandEmpty>No generation found.</CommandEmpty>
                    <CommandGroup>
                        {GENERATIONS.map((generation) => (
                            <CommandItem
                                key={generation.value}
                                value={generation.value}
                                onSelect={(currentValue) => {
                                    const params = new URLSearchParams(
                                        window.location.search,
                                    )
                                    params.set(
                                        'generation',
                                        currentValue as string,
                                    )
                                    router.push('?' + params.toString(), {
                                        scroll: false,
                                    })

                                    const val = currentValue as Generation
                                    if (
                                        val === 'image' &&
                                        model !== 'dalle2' &&
                                        model !== 'dalle3'
                                    ) {
                                        setModel('dalle2')
                                    }

                                    if (
                                        val !== 'image' &&
                                        (model === 'dalle2' ||
                                            model === 'dalle3')
                                    ) {
                                        setModel('gemini')
                                    }

                                    setValue(val)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === generation.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                {generation.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
