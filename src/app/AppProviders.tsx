import { createContext, useMemo, useState, type ReactNode, type JSX } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface Props {
	children?: ReactNode
}

type Theme = 'light' | 'dark'

export const ThemeContext = createContext<{ theme: Theme; setTheme: (value: Theme) => void }>({
	theme: 'light',
	setTheme: () => {}
})

function AppProviders({ children }: Props): JSX.Element {
	const [theme, setTheme] = useState<Theme>('light')
	const queryClient = useMemo(() => new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				refetchOnWindowFocus: false
			}
		}
	}), [])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeContext.Provider>
	)
}

export default AppProviders
