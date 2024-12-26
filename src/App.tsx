import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./features/auth/components/Login";
import { Logout } from "./features/auth/components/Logout";
import ListQuizzes from "./features/questions_manager/ListQuizzes";
import UnitEditor from "./features/questions_manager/UnitEditor";
import ListUnits from "./features/questions_manager/ListUnits";
//import CategoryPage from "./pages/CategoryPage";
//import { QuizAttemptsManager } from "./features/components/QuizAttemptsManager";
//import { S3ObjectsManager } from "./features/components/S3ObjectsManager";
//import { ListQuestions } from "./features/questions_manager/ListQuestions";
//import QuestionCreator from "./features/questions_manager/QuestionCreator";

const Home = lazy(() => import("./home_page/components/Home"))

const CategoryPage = lazy(() => import("./home_page/components/CategoryPage"))
const QuestionEditor = lazy(() => import("./features/questions_manager/QuestionEditor"))
const QuestionCreator = lazy(() => import("./features/questions_manager/QuestionCreator"))
const QuizAttemptsManager = lazy(() => import("./features/components/QuizAttemptsManager"))
const SocketContextComponent = lazy(() => import("./contexts/socket_context/Component"))
const S3ObjectsManager = lazy(() => import("./features/components/S3ObjectsManager"))
const ListQuestions = lazy(() => import("./features/questions_manager/ListQuestions"))

function getAuthFromSessionStorage() {
    const tokenString = sessionStorage.getItem('auth');
    if (tokenString !== null)
      return JSON.parse(tokenString)
    else {
      return null
    }
  }

function App() {
    //const { darkTheme, toggleTheme } = useContext(ThemeContext) as ThemeContextInterface;
    //const {socket, uid, users, user_uuids} = useContext(SocketContext).SocketState;
    const [auth, setAuth] = useState(getAuthFromSessionStorage());

    
      const onLogin = (userToken: string) => {
        setAuth(userToken)
        //also persits auth state in session Storage so that user is still logged after a page refresh
        sessionStorage.setItem('auth', JSON.stringify(userToken));
      }

      if (!auth) {
        return (
        <>
        <Login onLoginSuccess={onLogin} />
   
        </>
        )
      }
    
      const onLogout = () => {
        sessionStorage.clear()
        setAuth(null)
    }

  return (
    <>
      <SocketContextComponent>
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/logout" element={<Logout onLogout={onLogout} />} />
              <Route path="/" element={<Home />}>
                <Route path="/categories/:categoryId" element={<CategoryPage />}>
                  <Route path="sub_categories/:sub_categoryId" element={<ListUnits />} />

                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id" element={<ListQuizzes />} />
                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id/questions/:quiz_id" element={<ListQuestions />} />

                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id/questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
                  <Route path="sub_categories/:sub_categoryId/edit_unit/:unit_id" element={<UnitEditor />} />
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id/create_question/:format" element={<QuestionCreator />} />

                </Route>
                <Route path="/manage_quiz_attempts" element={<QuizAttemptsManager />} />
                <Route path="/manage_s3_objects" element={<S3ObjectsManager />} />
              </Route>
            </Routes>
          </BrowserRouter>

        </Suspense>
      </SocketContextComponent>
    </>
  );

}
//react-router-dom.js?v=ca023ebc:226 No routes matched location "/categories/1/sub_categories/7/list_units/list_quizzes/17" 

//"/categories/1/sub_categories/7/list_quizzes/17/questions/77" 

export default App;
/*
return (
    <>
      <SocketContextComponent>
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>
              <Route path="/logout" element={<Logout onLogout={onLogout} />} />
              <Route path="/" element={<Home />}>
                <Route path="/categories/:categoryId" element={<CategoryPage />}>
                  <Route path="sub_categories/:sub_categoryId" element={<SubCategoryPageTeacher />}>
                    <Route path="quizzes/:unit_id" element={<ListQuizzes />} />
                    <Route path="quizzes/:unit_id/questions/:quiz_id" element={<ListQuestions />} />
                    <Route path="quizzes/:unit_id/questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
                  </Route>
                  <Route path="sub_categories/:sub_categoryId/edit_unit/:unit_id" element={<UnitEditor />} />
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id/create_question/:format" element={<QuestionCreator />} />
                </Route>
                <Route path="/manage_quiz_attempts" element={<QuizAttemptsManager />} />
                <Route path="/manage_s3_objects" element={<S3ObjectsManager />} />
              </Route>
            </Routes>
          </BrowserRouter>

        </Suspense>
      </SocketContextComponent>
    </>
  );
*/
