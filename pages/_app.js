import '../styles/globals.css'
import { Toaster } from "@/components/ui/sonner"
import {ThemeProvider} from "../providers/theme-provider";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  )
}

export default MyApp
