import {ThemeProvider} from "@/components/theme-provider.tsx";
import Header from "@/components/Header.tsx";
import Main from "@/components/Main.tsx";
import Footer from "@/components/Footer.tsx";


function App() {

  return (
    <>
        <ThemeProvider>
            <Header/>
            <Main/>
            <Footer/>
        </ThemeProvider>
    </>
  )
}

export default App
