import { API_ORIGIN } from "./api";

export function mediaUrl(path) {
  if (!path) {
    return "/assets/default.png";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return `${API_ORIGIN}${path}`;
  }

  return path;
}
