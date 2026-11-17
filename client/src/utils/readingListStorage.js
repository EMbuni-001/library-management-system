
// Storage keys are namespaced so this app never collides with other
// projects running on the same localhost origin.
const GUEST_KEY = 'lms.readingList.guest';

function buildUserKey(userId) {
  return `lms.readingList.user.${userId}`;
}

// A logged-out visitor reads the guest list; a logged-in member reads
// their own account-scoped list.
export function getStorageKey(userId) {
  if (userId === null || userId === undefined) {
    return GUEST_KEY;
  }
  return buildUserKey(userId);
}

export function getGuestKey() {
  return GUEST_KEY;
}

// Never trust localStorage. It is user-editable text, so validate the
// shape before letting it into application state.
export function loadList(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) => item && item.id !== undefined && item.id !== null,
    );
  } catch (error) {
    // Corrupted JSON or storage blocked by the browser: start empty
    // rather than crashing the whole app.
    return [];
  }
}

export function saveList(key, list) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    // Quota exceeded or storage disabled. The list still works for this
    // session; it simply will not survive a refresh.
  }
}

export function removeList(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    // Nothing sensible to do if storage is unavailable.
  }
}

// Combines two lists, keeping the first occurrence of each book id.
export function mergeLists(existing, incoming) {
  const merged = [...existing];

  incoming.forEach((book) => {
    const alreadyPresent = merged.some((item) => item.id === book.id);
    if (!alreadyPresent) {
      merged.push(book);
    }
  });

  return merged;
}

// STRETCH GOAL: a visitor curates a list before logging in. On login we
// fold that guest list into the account list and clear the guest copy so
// the next visitor on this machine starts fresh.
export function mergeGuestListIntoUser(userId) {
  if (userId === null || userId === undefined) {
    return;
  }

  const guestList = loadList(GUEST_KEY);
  if (guestList.length === 0) {
    return;
  }

  const userKey = getStorageKey(userId);
  const accountList = loadList(userKey);

  saveList(userKey, mergeLists(accountList, guestList));
  removeList(GUEST_KEY);
}