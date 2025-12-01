// ==========================================
// 🔗 MASTER REDIRECT HELPER FILE
// Contains:
// 1) Role-based redirect
// 2) Dashboard redirect
// 3) Notification redirect mapping
// ==========================================

// ---------- MENTEE ----------
export function getMenteeRedirect(tab: string = "overview") {
  return `/mentee?tab=${tab}`;
}

// ---------- MENTOR ----------
export function getMentorRedirect(tab: string = "overview") {
  return `/mentor?tab=${tab}`;
}

// ---------- ADMIN ----------
export function getAdminRedirect(tab: string = "overview") {
  return `/admin?tab=${tab}`;
}

// ---------- GENERIC ROLE-BASED REDIRECT ----------
export function getRedirectForRole(
  role: string,
  tab: string = "overview"
): string {
  switch (role.toLowerCase()) {
    case "mentee":
      return getMenteeRedirect(tab);

    case "mentor":
      return getMentorRedirect(tab);

    case "admin":
      return getAdminRedirect(tab);

    default:
      return "/";
  }
}

// ==========================================
// 🔔 NOTIFICATION ROUTES BY TYPE
// ==========================================
export function getNotificationRedirect(
  role: string,
  type: string
) {
  switch (type) {
    case "new_message":
      return getRedirectForRole(role, "messages");

    case "profile_incomplete":
      return getRedirectForRole(role, "profile");

    case "achievement_unlocked":
      return getRedirectForRole(role, "achievements");

    case "new_session":
      return getRedirectForRole(role, "schedule");

    case "cv_uploaded":
      return getRedirectForRole(role, "cv-review");

    case "cv_review_ready":
      return getRedirectForRole(role, "reports");

    case "new_mentor":
      return getRedirectForRole(role, "mentors");


    // fallback → dashboard
    default:
      return getRedirectForRole(role, "overview");
  }
}
