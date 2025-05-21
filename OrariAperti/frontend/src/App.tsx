
import Header from "@/components/Header.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";


function App() {

  return (
    <>
        <ThemeProvider>
            <Header/>
        </ThemeProvider>
    </>
  )
}

export default App
