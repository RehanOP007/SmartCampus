export const getDefaultRoute = (role) => {
  const normalizedRole = (role || "").toLowerCase();

  switch (normalizedRole) {
    case "admin":
      return "/smartcampus/admin-dashboard";

    case "technician":
      return "/smartcampus/technician-dashboard";

    case "user":
      return "/smartcampus/user-dashboard";

    default:
      return "/smartcampus/login";
  }
};