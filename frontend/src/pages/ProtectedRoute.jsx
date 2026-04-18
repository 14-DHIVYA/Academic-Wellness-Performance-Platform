import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {}
  }

  if (!token || !user) {
    console.error("ProtectedRoute: Missing token or user", { token, userString });
    return (
      <div style={{ padding: 20 }}>
        <h2>Session Error</h2>
        <p>Could not find your login session.</p>
        <pre>{JSON.stringify({ tokenMissing: !token, userMissing: !user, userString }, null, 2)}</pre>
        <button onClick={() => window.location.href = '/'}>Go back to Home</button>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error("ProtectedRoute: Role not allowed", { role: user?.role, allowedRoles });
    return (
      <div style={{ padding: 20 }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <pre>{JSON.stringify({ yourRole: user?.role, requiredRoles: allowedRoles }, null, 2)}</pre>
        <button onClick={() => window.location.href = '/'}>Go back to Home</button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;