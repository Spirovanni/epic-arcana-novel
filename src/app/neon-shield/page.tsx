import { NeonShieldCanvas } from '@/components/NeonShieldCanvas'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Neon Shield Prototype',
    description: 'Interactive SVG Graph Animation',
}

export default function NeonShieldPage() {
    return (
        <main className="w-screen h-screen bg-black overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0">
                <NeonShieldCanvas />
            </div>
        </main>
    )
}
