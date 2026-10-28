'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	})
}

export default function TanStackProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => makeQueryClient())

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}