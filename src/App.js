import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeLogin from './Components/EmployeeLogin';
import AdminRegister from './Components/AdminRegister';
import DepartmentList from './Components/DepartmentList';
import DepartmentLogin from './Components/DepartmentLogin';
import AdminDashboard from './Components/AdminDashboard';
import AdminLogin from './Components/AdminLogin';
import EmployeRegister from './Components/EmployeeRegister';
import CreateDepartment from './Components/CreateDepartment';
import DepartmentCategory from './Components/DepartmentCategory';
import UserDeatails from './Components/UserDeatails';
import CreateUser from './Components/CreateUser';

import Recharge from './Components/Recharge';
import Home from './Components/Home';
import Portfolio from './Components/Portfolio';
import DepartmentDashboard from './Components/DepartmentDashboard';
import AdminControlPanel from './Components/AdminControlPanel';
import TrainingBox from './Components/TrainingBox';
import RechargePage from './Components/Recharge';
import CreateDepartmentMember from './Components/CreateDepartmentMember';
import ExpiredShifts from './Components/ExpiredShifts';
import Wallet from './Components/Wallet';
import RechargeManager from './Components/RechargeManager';
import AddUserAmount from './Components/AddUserAmount';
import NotificationMaker from './Components/NotificationMaker';
import Notification from './Components/Notification';
import Wishlist from './Components/WishList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
    <ToastContainer />
      <Routes>
      
        <Route path="/" element={<DepartmentList />} />
        <Route path="/EmployeeLogin" element={<EmployeeLogin/>}/>
        <Route path="/AdminLogin" element={<AdminLogin/>}/>
        <Route path="/AdminRegister" element={<AdminRegister />} />
        <Route path='/DepartmentLogin' element={<DepartmentLogin/>} />
        <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
        <Route path='/EmployeeRegister' element={<EmployeRegister/>}/>
        <Route path='/AdminDashboard/CreateDepartment' element={<CreateDepartment/>}/>
        <Route path='/AdminDashboard/DepartmentCategory' element={<DepartmentCategory/>}/>
        <Route path='/AdminDashboard/UserDetails' element={<UserDeatails/>}/>
        <Route path='/AdminDashboard/CreateUser' element={<CreateUser/>}/>
      
        <Route path="/DepartmentDashboard" element={<DepartmentDashboard/>}/>
        <Route path="/Recharge/:departmentId" element={<Recharge />} />
        <Route path="/AdminDashboard/AdminControlPanel" element={<AdminControlPanel />} />
        <Route path="/Home/Traningbox" element={<TrainingBox/>} />
        <Route path='/Home' element={<Home/>}/>
        <Route path='/Portfolio' element={<Portfolio/>}/>
        <Route path="/Recharge/:id" element={<RechargePage/>} />
        <Route path='/AdminDashboard/CreateDepartmentMember' element={<CreateDepartmentMember/>}/>
        <Route path='/ExpiredShifts' element={<ExpiredShifts/>}/>
        <Route path='/Wallet' element={<Wallet/>}/>
        <Route path='/AdminDashboard/RechargeManager' element={<RechargeManager/>}/>
        <Route path='/AdminDashboard/AddAmount' element={<AddUserAmount/>}/>
        <Route path='/AdminDashboard/NotificationMaker' element={<NotificationMaker/>}/>
        <Route path='/Notification' element={<Notification/>}/>
        <Route path='/Wishlist' element={<Wishlist/>}/>

      
        
        
      </Routes>
    </Router>
  );
}

export default App;
