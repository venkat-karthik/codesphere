export type UserRole = "student" | "instructor" | "admin";

export const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  student: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  instructor: "bg-green-500/10 text-green-400 border-green-500/20",
  admin: "bg-primary/10 text-primary border-primary/20",
};

export const ROLE_BADGE_GRADIENT: Record<UserRole, string> = {
  student: "bg-blue-500/20 text-blue-400",
  instructor: "bg-green-500/20 text-green-400",
  admin: "badge-gradient",
};

/** Routes only instructors and admins can access */
export const INSTRUCTOR_ROUTES = ["/instructor"];

/** Decode role from JWT payload stored in cookie */
export function getRoleFromToken(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return (payload.role as UserRole) ?? "student";
  } catch {
    return null;
  }
}
