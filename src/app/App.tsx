import { RouterProvider } from 'react-router-dom'
import AppProviders from './AppProviders'
import router from './router'
import type { JSX } from 'react'

function App(): JSX.Element {
	return (
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	)
}

export default App
