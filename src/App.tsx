import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./features/auth/components/Login";
import { Logout } from "./features/auth/components/Logout";
//import ListQuizzes from "./features/questions_manager/ListQuizzes";
import UnitEditor from "./features/questions_manager/UnitEditor";
import ListUnits from "./features/questions_manager/ListUnits";
import ListGames from "./features/questions_manager/ListGames"
import GameEditor from "./features/components/GameEditor";
import FileUpload from "./features/utils/FileUpload";
import OrphanQuestionsManager  from "./features/utils/OrphanQuestionsManager";
import GameCreator from "./features/components/GameCreator";
import { Utils } from "./features/utils/Utils";
import NewUnit from "./features/questions_manager/NewUnit";
//import UsersManager from "./features/components/UsersManager";
import ListUsers from "./features/questions_manager/ListUsers";
import UserEditor from "./features/questions_manager/UserEditor";
import NewUser from "./features/utils/NewUser";
import { EditCategory } from "./features/components/EditCategory";
import { NewSubCategory } from "./features/components/NewSubCategory";
import { EditSubCategory } from "./features/components/EditSubCategory";
import QuestionsByFormat from "./features/utils/QuestionsByFormat";
import AllQuizzes from "./features/utils/AllQuizzes";
import { RootUrlProvider } from "./contexts/root_url";
import ListQuizzes from "./features/questions_manager/ListQuizzes";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListSubCategories from "./features/questions_manager/ListSubCategories";
import ListCagegories from "./features/questions_manager/ListCategories";

const Home = lazy(() => import("./home_page/components/Home"))

const CategoryPage = lazy(() => import("./home_page/components/CategoryPage"))
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

    const queryClient = new QueryClient();
    
      const onLogin = (userToken: string) => {
        setAuth(userToken)
        //also persits auth state in session Storage so that user is still logged after a page refresh
        sessionStorage.setItem('auth', JSON.stringify(userToken));
      }

      if (!auth) {
        return (
        <>
        <RootUrlProvider>
        <Login onLoginSuccess={onLogin} />
        </RootUrlProvider>
   
        </>
        )
      }
    
      const onLogout = () => {
        sessionStorage.clear()
        setAuth(null)
    }

    //get_questions_by_format
    //matched location "/categories/6/sub_categories/13/list_quizzes/37/edit_quiz/146
    ///categories/1/list_sub_categories/3/list_units/list_quizzes/7" 
    /*
<a class="italic text-blue-300" href="/categories/1/list_sub_categories/6/list_units/63/list_quizzes">Quizzes</a>

<a class="italic text-blue-300" href="/categories/1/list_sub_categories/6/list_units/62/list_quizzes">Quizzes</a>
    */
//"/categories/categories/1/list_sub_categories?category_name=Grammar
/*
routes matched location "/10/list_sub_categories/24/list_units/71/list_quizzes/edit_quiz/342" 
*/

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <RootUrlProvider>
    
      <SocketContextComponent>
        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
      
            <Routes>
              <Route path="/logout" element={<Logout onLogout={onLogout} />} />
              <Route path="/categories" element={<ListCagegories />} />
              <Route path="/:categoryId/list_sub_categories" element={<ListSubCategories />} />
              <Route path="/:categoryId/list_sub_categories/:sub_categoryId/list_units" element={<ListUnits />} />
              <Route path="/:categoryId/list_sub_categories/:sub_categoryId/list_units/:unitId/list_quizzes" element={<ListQuizzes />} />
              <Route path="/:categoryId/list_sub_categories/:sub_categoryId/list_units/:unitId/list_quizzes/:quizId/list_questions" element={<ListQuestions />} />
              <Route path="/" element={<Home />}>
               
                
                  <Route path="edit_category" element={<EditCategory />} ></Route>
                
                 
                  <Route path="sub_categories/new_sub_category" element={<NewSubCategory />} ></Route>
                  <Route path="sub_categories/:sub_categoryId/edit" element={<EditSubCategory />} />
                  <Route path="sub_categories/:sub_categoryId/create_unit" element={<NewUnit />} />
                  <Route path="sub_categories/:sub_categoryId/edit_unit/:unit_id" element={<UnitEditor />} />

                
               
              
                <Route path="/utils" element={<Utils />} >
                  <Route path="manage_users" element={<ListUsers />} >
                    <Route path="new_user" element={<NewUser />} />
                  </Route>
                  <Route path="manage_quiz_attempts" element={<QuizAttemptsManager />} />
                  <Route path="get_questions_by_format" element={<QuestionsByFormat />} />
                  <Route path="get_all_quizzes" element={<AllQuizzes />} />
                  <Route path="manage_s3_objects" element={<S3ObjectsManager />} />
                  <Route path="manage_orphan_questions" element={<OrphanQuestionsManager />} />
                  <Route path="upload_file" element={<FileUpload />} />
                  <Route path="list_games" element={<ListGames />} />
                  <Route path="new_game" element={<GameCreator />} />
                  <Route path="list_games/edit/:id" element={<GameEditor />} />
                  <Route path="manage_users/edit_user/:id" element={<UserEditor />} />
                </Route>
              </Route>
            </Routes>
           
          </BrowserRouter>

        </Suspense>
      </SocketContextComponent>
     
      </RootUrlProvider>
      </QueryClientProvider>
    </>
  );

}
//react-router-dom.js?v=ca023ebc:226 No routes matched location "/categories/1/sub_categories/7/list_units/list_quizzes/17" 
////http://localhost:5173/categories/2/sub_categories/15/list_quizzes/42/questions/155/take_question/5069

//http://localhost:5173/categories/2/sub_categories/15/list_quizzes/42/questions/155/edit_question/3602

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
                  <Route path="sub_categories/:sub_categoryId" element={<ListUnits />} />
                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id" element={<ListQuizzes />} />
                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id/questions/:quiz_id" element={<ListQuestions />} />
                  <Route path="sub_categories/:sub_categoryId/list_quizzes/:unit_id/questions/:quiz_id/edit_question/:question_id" element={<QuestionEditor />} />
                  <Route path="sub_categories/:sub_categoryId/create_unit" element={<NewUnit />} />
                  <Route path="sub_categories/:sub_categoryId/edit_unit/:unit_id" element={<UnitEditor />} />
                  <Route path="sub_categories/:sub_categoryId/list_questions/:quiz_id/create_question/:format" element={<QuestionCreator />} />
                </Route>

                <Route path="/utils" element={<Utils />} >
                  <Route path="manage_quiz_attempts" element={<QuizAttemptsManager />} />
                  <Route path="manage_s3_objects" element={<S3ObjectsManager />} />
                  <Route path="manage_orphan_questions" element={<OrphanQuestionsManager />} />
                  <Route path="upload_file" element={<FileUpload />} />
                  <Route path="list_games" element={<ListGames />} />
                  <Route path="new_game" element={<GameCreator />} />
                  <Route path="list_games/edit/:id" element={<GameEditor />} />
                 
                </Route>
                
  
                
              </Route>
            </Routes>
          </BrowserRouter>

        </Suspense>
      </SocketContextComponent>
    </>
  );

*/
