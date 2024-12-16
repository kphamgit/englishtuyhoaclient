import {  useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./features/auth/components/Login";
import { Logout } from "./features/auth/components/Logout";
import CategoryPage from "./pages/CategoryPage";
import { QuizAttemptsManager } from "./features/components/QuizAttemptsManager";
import { S3ObjectsManager } from "./features/components/S3ObjectsManager";
import { ListQuestions } from "./features/questions_manager/ListQuestions";


const Home = lazy(() => import("./home_page/components/Home"))

const SubCategoryPageTeacher = lazy(() => import("./pages/SubCategoryPageTeacher"))
const QuestionEditor = lazy(() => import("./features/questions_manager/QuestionEditor"))
const SocketContextComponent = lazy(() => import("./contexts/socket_context/Component"))

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
              
                    <Route path="sub_categories_teacher/:sub_categoryId" element={<SubCategoryPageTeacher />} />
                   
                    <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id" element={<ListQuestions />}/>
                    <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
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

export default App;
/*
return (
        <>
      <div className={`flex h-screen w-screen items-center justify-center bg-bgColor text-textColor`}>
          <div className="rounded-md bg-textColor p-8 text-bgColor">
              <h1 className="text-3xl">Theme {darkTheme ? "dark" : "light"}</h1>
              <button
                  onClick={toggleTheme}
                  className="mt-2 w-full rounded-none bg-bgColor p-2 text-center text-2xl uppercase tracking-[3px] text-textColor transition-all duration-300 ease-in-out hover:rounded-lg"
              >
                  Toggle
              </button>
          </div>
      </div>
           <BrowserRouter>
           <Routes>
          
             <Route path="/" element={<Home />}>
     
             </Route>
           </Routes>
         </BrowserRouter>
         </>
  );
  
*/
/*
 <SocketContextComponent>
      <TtSpeechProvider>
      <PollyProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/logout" element={<Logout onLogout={onLogout} />} />
            <Route path="/" element={<Home />}>
                <Route path="/categories/:categoryId" element={<CategoryPage />}>
                  <Route path="sub_categories_student/:sub_categoryId" element={<SubCategoryPageStudent />} />
                  <Route path="sub_categories_teacher/:sub_categoryId" element={<SubCategoryPageTeacher />} />
                  <Route path="sub_categories/:sub_category_name/quizzes/:quizId" element={<QuizPageVideo />} />
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id" element={<ListQuestions />}/>
                  <Route path="sub_categories/:sub_category_name/list_questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
                </Route>
                <Route path="/live_text" element={<LiveText />} />
                <Route path="/live_quiz" element={<QuizPageLive />} />
                <Route path="/live_game/:game_id/:backcolor" element={<MemoryGame />} />
  
            </Route>
          </Routes>
        </BrowserRouter>
        </PollyProvider>
      </TtSpeechProvider>
      </SocketContextComponent>
*/