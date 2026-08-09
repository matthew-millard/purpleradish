import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("signup", "routes/signup/signup.tsx"),
  route("login", "routes/login/login.tsx"),
  route("logout", "routes/logout/logout.tsx"),
  route("dashboard", "routes/dashboard/dashboard.tsx"),
] satisfies RouteConfig;
