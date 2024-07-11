import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedData from "./pages/Data";
import NavBar from "./components/Navbar";
import Register from "./pages/Register";
import Page from "./pages/Page";
import SheetDetail from "./pages/SheetDetail";
import GroupDetail from "./pages/GroupDetail";
import Groups from "./pages/Groups";
import Subs from "./pages/Subs";
import Teachers from "./pages/Teachers";
import Profille from "./pages/Profille";
import UpdateUser from "./pages/UpdateProf";
import AddSub from "./pages/AddSub";
import AddSheet from "./pages/AddSheet";
import SheetDetail2 from "./pages/SheetDetaik2";
import AddGroup from "./pages/AddGroup";

function App() {
  const user2 = JSON.parse(localStorage.getItem("user2"));
  const id = localStorage.getItem("id");
  const user1 = user2.find((j) => j.id == id);
  const [loged, setLogi] = useState(localStorage.getItem("user"));
  return (
    <>
      <BrowserRouter>
        <NavBar loged={loged} set={setLogi} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/login"
            element={
              loged == "anon" ? (
                <Login set={setLogi} />
              ) : (
                <Navigate to="/main" />
              )
            }
          />
          <Route
            path="/main"
            element={
              loged != "anon" ? <ProtectedData /> : <Navigate to="/login" />
            }
          />
          <Route path="/profile" element={<Profille />} />
          <Route path="/page" element={<Page />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/subjects" element={<Subs user={user1}/>} />
          <Route path="/teachers" element={<Teachers />} />

          <Route path="/update_user" element={<UpdateUser />} />
          
          <Route path='/add_sub' element={< AddSub />}/>
          <Route path='/add_sheet' element={< AddSheet />}/>
          <Route path='add_gr' element={<AddGroup />} />
          
          <Route path="/sheet/:sheetId" element={user1.role!='student'?<SheetDetail2 />:<SheetDetail />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/*" element={<Navigate to="/page" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
