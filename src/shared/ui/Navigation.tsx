import { useNavigate } from "react-router";
import Button from "./Button";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <nav>
      <ul>
        <li>
          <Button
            onClick={() => {
              navigate("/home");
            }}>
            Home
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
