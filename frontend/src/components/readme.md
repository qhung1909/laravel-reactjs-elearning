// File src/components chứa các components tái sử dụng liên tục
// Ví dụ có components navbar.jsx như sau

//
const Navbar = () => {

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

//