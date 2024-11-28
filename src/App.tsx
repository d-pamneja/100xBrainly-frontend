import './App.css'
import { useAuth } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { nav } from './structure/navigation';
import { Toaster } from 'react-hot-toast';


function App() {

  const { isLoggedIn } = useAuth()

  return (
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
        <BrowserRouter>
          <Toaster position="top-center"/>
            <Routes>
              {nav.map((r, i) => {
                  if (!r.isRestricted) {
                    return <Route key={i} path={r.path} element={r.element} />;
                  } else if (r.name === "Home") {
                    if(isLoggedIn){
                      return (
                        <Route
                          key={i}
                          path={r.path}
                          element={r.element}
                        />
                      );
                    }
                  }
                  return null;
                })}
            </Routes>
        </BrowserRouter>
    </main>
  )
}

export default App
