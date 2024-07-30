import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RecipeForms from './components/Forms/RecipeForms';

import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <Router>
        <div className="App">
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<PrivateRoute />}>
                <Route path='/' element={<HomePage />}/>
              </Route>
              <Route path='/recipe/form' element={<PrivateRoute />}>
                <Route path='/recipe/form' element={<RecipeForms />}/>
              </Route>
              <Route path='/login/' element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </div>
    </Router>
  );
}

export default App;
