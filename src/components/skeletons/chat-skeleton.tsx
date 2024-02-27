import { Skeleton } from '../ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export const ChatSkeleton = () => {
    return (
        <div className='space-y-6'>
            {new Array(5).fill(0).map((_, idx) => (
                <Card key={idx}>
                    <CardHeader>
                        <CardTitle>
                            <div className='flex items-center gap-2'>
                                <Skeleton className='h-10 w-10 rounded-full' />
                                <Skeleton className='h-7 w-32' />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <Skeleton className='h-5 w-full' />
                        <Skeleton className='h-5 w-full' />
                        <Skeleton className='h-5 w-20' />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
