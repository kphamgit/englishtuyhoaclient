import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useAxiosFetch } from '../../hooks';
import { useAppSelector } from '../../redux/store';
//import { VscTriangleDown } from "react-icons/vsc";

type Category = {
  id: number;
  name: string;
  sub_categories: SubCategory[]
}

interface SubCategory {
  id: number,
  name: string
  sub_category_number: number
  level: string
}

export default function CategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const { data: category, loading, error } = useAxiosFetch<Category>({ url: `/categories/${params.categoryId}`, method: 'get' });
  const user = useAppSelector(state => state.user.value)

  /*
         {categories?.map((category:any) => (

                <div key={category.id} className='flex flex-row'>
                  <NavLink
                    to={`/categories/${category.id}`}
                    className={({ isActive }) => {
                      return isActive ? 'text-textColor1 bg-navCatButtonBgActive text-lg p-2 rounded-t-md' : 'rounded-md text-lg text-textColor1 bg-navCatButtonBgInActive p-2 hover:bg-navCatButtonBgInHover';
                    }}
                  >
                    {category.name}
                  </NavLink>
                </div>
              )
              
              )
            
            }
  */


  return (
    <>
    
    <div className='bg-bgColor1 p-3 rounded-b-md m-0'>
      <div className='flex flex-row gap-1 bg-bgColor1 text-md mx-0'>
        {category?.sub_categories ? 
          category?.sub_categories.map(sub_cat => (

            <div key={sub_cat.id} className='flex flex-row'>
            <NavLink
              to={`sub_categories/${sub_cat.id}`}
              className={({ isActive }) => {
                return isActive ? 'text-textColor1 bg-navCatButtonBgActive text-lg p-2 rounded-t-md' : 'rounded-md text-lg text-textColor1 bg-navCatButtonBgInActive p-2 hover:bg-navCatButtonBgInHover';
              }}
            >
              {sub_cat.name}
            </NavLink>
          </div>
    
        )
        
        ) 

        : null
        }
      </div>
      </div>
      <div className='bg-bgColor3'>
      <Outlet />
      </div>
    </>
  );
}
// <Route path="sub_categories/:sub_categoryId/list_units" element={<ListUnits />} />
/*
  return (
    <>
    
    <div className='bg-bgColor1 p-3 rounded-b-md m-0'>
      <div className='flex flex-row gap-1 bg-bgColor1 text-md mx-0'>
        {category?.sub_categories ? 
          category?.sub_categories.map(sub_cat => (
          <div className='bg-navCatButtonBgActive p-1 text-textColor1  rounded-md hover:bg-navCatButtonBgInHover' key={sub_cat.id} >
            <Link to={`sub_categories/${sub_cat.id}`} >{sub_cat.name}</Link> 
          </div>
        )) 
        : null
        }
      </div>
      </div>
      <div className='bg-bgColor3'>
      <Outlet />
      </div>
    </>
  );
*/