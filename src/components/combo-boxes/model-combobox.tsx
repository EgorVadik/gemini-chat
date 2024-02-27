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
import { MODELS } from '@/lib/constants'
import { useAtom } from 'jotai'
import { generationAtom, modelAtom } from '@/atoms'
import { Model } from '@/types'

export function ModelCombobox() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = useAtom(modelAtom)
    const [generation] = useAtom(generationAtom)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'
                >
                    {value
                        ? MODELS.find((model) => model.value === value)?.label
                        : 'Select model...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search model...' />
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                        {MODELS.map((model) => (
                            <CommandItem
                                key={model.value}
                                value={model.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue as Model)
                                    setOpen(false)
                                }}
                                disabled={
                                    ((model.value === 'dalle2' ||
                                        model.value === 'dalle3') &&
                                        generation !== 'image') ||
                                    (model.value !== 'dalle2' &&
                                        model.value !== 'dalle3' &&
                                        generation === 'image')
                                }
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === model.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                {model.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
