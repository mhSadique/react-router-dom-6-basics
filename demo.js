import { NavLink, Routes, Route, Navigate, BrowserRouter, useNavigate } from "react-router-dom";
/* 1. 'activeClassName' prop in 'NavLink' is replace by 'className' prop and the value of the 'className' is a function that takes an object as a parameter and the object has a property 'isActive' which is a boolean
 */
const Navbar = () => {
    return (
        <NavLink to="/login" className={(navInfo) => navInfo.isActive ? 'class name here' : ''}>
            Login
        </NavLink>
    );
};

const App = () => {
    return (
        // 'BrowserRouter' stays like before
        <BrowserRouter>
            {/* 'Switch' is replaced by 'Routes'. */}
            {/* And you don't need to order the routes to match exactly because the new version always finds the exact match. So, 'exact' prop is not needed anymore */}
            <Routes>
                {/* 'Redirect' is replaced by 'Navigate' */}
                <Route path="/" element={<Navigate to="/hello" />} />
                {/* The component to be rendered on a specific route is not given as a child like before. Rather it is given as a JSX element as a value of prop named 'element'. */}
                <Route path="/hello/*" element={<ComponentAsJSXElement />}>
                    {/* When using nested Routes in a nested components, put only the relative path relative to the nesting component's route name in the nested Route's 'path' prop */}
                    <Route path="world" element={<p>This is world!</p>} />
                    <Route path="world2" element={<p>This is world2!</p>} />
                    {/* (Shown above) To organize your routing setup, you can put the nested Routes as the children of the nesting Route without using the Routes in a component seperately but then you have to put a placeholder for the Route in the component. And as a placeholder for the routes, you can use 'Outlet' component provided by react-route-dom */}
                </Route>
                <Route path="/posts" element={<ComponentAsJSXElement />} />
                {/* 'useParams' works just like before */}
                <Route path="/posts/:postId" element={<ComponentAsJSXElement />} />
            </Routes>
        </BrowserRouter>
    );
}



const CuteComponent = () => {
    // 'useHistory' is replaced by 'useNavigate' which upon calling, returns a function and this function works like 'history.push()' method. See docs for more info
    const navigate = useNavigate();
    return (
        <div>
            <button
                onClick={() => {
                    navigate('/login')
                }}
            >
                Go to login page
            </button>
        </div>
    );
};

////////////////////
// Private Routes //
////////////////////

// this function checks if the user is logged in
function useAuth() {
    const auth = false;
    return auth;
}

// This component takes the restricted component as it child. It checks if the user is logged in using 'useAuth' hook
// then it conditionally renders the the restricted component or the redirected component depending on the user's logged in status

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    return auth ? children : <Navigate to='/login' />;
};

// Then the PrivateRoute is used as the value of 'element' prop and the takes the restricted component as its child

function App2() {
  return (
    <>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

////////////////////////////////////////////////////////////
// Private Routes when you have multiple restricted routes//
////////////////////////////////////////////////////////////

// This time, instead of writing 'PrivateRoute', we write a component named 'PrivateOutlet' which is as follows: 
function PrivateOutlet() {
  const auth = useAuth();
    // import 'Outlet' from react-router-dom
    return auth ? <Outlet /> : <Navigate to='/login' />;
}

// Now use PrivateOutlet as follows 

function App3() {
  return (
    <>
      <Routes>
        <Route path='/*' element={<PrivateOutlet />}>
          <Route path="dashboard" element={<h2>This is our dashboard</h2>} />
          <Route path="secret-page" element={<h2>This is our secret page</h2>} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}
