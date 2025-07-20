import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import image from '../components/downloaded.png';
import './auth.css';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "../components/avatar.jsx";
const Auth = () => {
  const User = {
    id: "6",
    name: "Laks",
    email: "rajalakshmiaruna2005@gmail.com",
    image: image
  };
  const navigate=useNavigate();
  const handlepage=()=>{
    navigate(`/Error`)
  }
  return (
    
      <div className="auth-header" onClick={handlepage} style={{cursor:"pointer"}}>
        {User ? (
          <div className="auth-icons"  >
            <Avatar>
              <AvatarImage
                src={""}
                alt={User.name || ""}
                className="users"
              />
              <AvatarFallback fallbacktext={User.name.charAt(0).toUpperCase()} />
            </Avatar>
          </div>
        ) : (
          <button className='ico'>
            <AccountCircleIcon /> Sign in
          </button>
        )}
      </div>
    
  );
};

export default Auth;



