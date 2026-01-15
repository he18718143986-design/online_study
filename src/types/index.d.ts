// Minimal React/JSX shims to unblock type checking in environments without installed React typings

declare namespace React {
	type ReactNode = any
	type Key = string | number
	interface FC<P = {}> {
		(props: P & { children?: ReactNode; key?: Key }): JSX.Element | null
	}
	function createContext<T>(defaultValue: T): any
	function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void]
	function useEffect(effect: () => void | (() => void), deps?: any[]): void
	function useMemo<T>(factory: () => T, deps?: any[]): T
	function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T
}

declare module 'react' {
	export = React
	export const useState: typeof React.useState
	export const useEffect: typeof React.useEffect
	export const useMemo: typeof React.useMemo
	export const useCallback: typeof React.useCallback
}

declare module 'react/jsx-runtime' {
	export const jsx: any
	export const jsxs: any
	export const Fragment: any
}

declare module 'react-router-dom' {
	export const useParams: any
	export const useSearchParams: any
	export const useNavigate: any
	export const RouterProvider: any
	export function createBrowserRouter(...args: any[]): any
	export function createMemoryRouter(...args: any[]): any
	export const Outlet: any
	export const Link: any
	export const useMatches: any
}

declare module '@tanstack/react-query' {
	export const QueryClientProvider: any
	export class QueryClient {
		constructor(config?: any)
	}

	export interface QueryResult<TData = unknown> {
	data?: TData
	isLoading: boolean
	refetch: () => Promise<{ data?: TData }>
	[key: string]: any
		}

	export function useQuery<TData = unknown>(options: any): QueryResult<TData>
	export function useQueryClient(): { invalidateQueries: (opts: any) => Promise<void> }
}

declare module 'react-dom/client' {
	export const createRoot: any
}

declare module '*.json' {
	const value: any
	export default value
}

declare namespace JSX {
	interface IntrinsicAttributes {
		key?: React.Key
	}
}
