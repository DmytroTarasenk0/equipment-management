import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EquipmentDetails from "./pages/EquipmentDetails";
import AddEquipment from "./pages/AddEquipment";

function App() {
  const auth = useContext(AuthContext);

  if (auth?.loading)
    return <div className="container">Loading application...</div>;

  return (
    <>
      <header className="header">
        <h1 className="header-brand">MedEquip</h1>
        <div className="header-nav">
          {auth?.user ? (
            <>
              <span>
                Logged in as: <strong>{auth.user.name}</strong> (
                {auth.user.role})
              </span>
              <button onClick={auth.logout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <span>Please log in to continue.</span>
          )}
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={
              auth?.token ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/equipment/:id"
            element={
              auth?.token ? (
                <EquipmentDetails />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/add-equipment"
            element={
              auth?.token ? <AddEquipment /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={!auth?.token ? <Login /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
