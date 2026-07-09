const GUEST_NAME_KEY = "guestName";
const UMBRELLA_ID_KEY = "umbrellaId";

export function normalizeUmbrellaId(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const normalized = String(value).trim().replace(/\D/g, "");
  return normalized;
}

export function getStoredGuestName() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(GUEST_NAME_KEY) || "";
}

export function getStoredUmbrellaId() {
  if (typeof window === "undefined") {
    return "";
  }

  return normalizeUmbrellaId(window.localStorage.getItem(UMBRELLA_ID_KEY));
}

export function setStoredGuestName(guestName) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GUEST_NAME_KEY, guestName || "");
}

export function setStoredUmbrellaId(umbrellaId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(UMBRELLA_ID_KEY, normalizeUmbrellaId(umbrellaId));
}

export function setGuestSession({ guestName, umbrellaId }) {
  const normalizedGuestName = typeof guestName === "string" ? guestName.trim() : "";
  const normalizedUmbrellaId = normalizeUmbrellaId(umbrellaId);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(GUEST_NAME_KEY, normalizedGuestName);
    window.localStorage.setItem(UMBRELLA_ID_KEY, normalizedUmbrellaId);
  }

  return {
    guestName: normalizedGuestName,
    umbrellaId: normalizedUmbrellaId,
  };
}

export function buildHomePath(umbrellaId) {
  const normalizedUmbrellaId = normalizeUmbrellaId(umbrellaId);

  if (!normalizedUmbrellaId) {
    return "/welcome";
  }

  return `/u/${normalizedUmbrellaId}`;
}
