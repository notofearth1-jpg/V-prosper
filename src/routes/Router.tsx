import { BrowserRouter as Router } from "react-router-dom";
import PublicRouter from "./RoutePublic";
import RouterUser from "./RouteUser";
import RouteTrainer from "./RouteTrainer";

const AppRouter: React.FC = () => {
  return (
    <div>
      <Router>
        <RouterUser />
        <RouteTrainer />
        <PublicRouter />
      </Router>
    </div>
  );
};

export default AppRouter;
