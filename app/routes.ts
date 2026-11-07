import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  layout("routes/auth/AuthLayout.tsx", [
    route("signup", "routes/auth/signup/signup.tsx"),
    route("login", "routes/auth/login/login.tsx"),
    route("logout", "routes/auth/logout/logout.tsx"),
    route("verify", "routes/auth/verify/verify.tsx"),
  ]),
  route("dashboard", "routes/dashboard/dashboard.tsx"),
] satisfies RouteConfig;
