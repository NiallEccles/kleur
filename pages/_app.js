import '../styles/globals.css'
import {ThemeProvider} from "../providers/theme-provider";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
