import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import './App.css';
import Header from './components/Header';
import RecipeForm from './components/forms/RecipeForm';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipePage from './pages/RecipePage';
import UserRecipePage from './pages/UserRecipePage'

import StepForm from "./components/forms/StepForm";
import RecipeComponentForm from "./components/forms/RecipeComponentForm";


import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <Router>
        <div className="App dark">
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<PrivateRoute />}>
                <Route path='/' element={<HomePage />}/>
              </Route>
              <Route path='/recipe/:recipeId' element={<PrivateRoute />}>
                <Route path='/recipe/:recipeId' element={<RecipePage />}/>
                <Route path="/recipe/:recipeId/form" element={<StepForm />} />
                <Route path="/recipe/:recipeId/component-form" element={<RecipeComponentForm/>}/>
              </Route>
              <Route path='/user/:userId/recipes' element={<PrivateRoute />}>
                <Route path='/user/:userId/recipes' element={<UserRecipePage />}/>
              </Route>
              <Route path='/login/' element={<LoginPage />} />
              <Route path='/register/' element={<RegisterPage />} />
            </Routes>
          </AuthProvider>
        </div>
    </Router>
  );
}

export default App;
