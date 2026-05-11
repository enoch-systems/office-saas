export function getStudentIdInitials(fullName: string): string {
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    return "ST";
  }

  const nameParts = trimmedName
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z]/g, ""))
    .filter(Boolean);

  if (nameParts.length === 0) {
    return "ST";
  }

  const firstInitial = nameParts[0]?.[0] ?? "S";
  const lastInitial = nameParts[nameParts.length - 1]?.[0] ?? firstInitial;

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function getStableFourDigitSuffix(source: string): string {
  let hash = 0;

  for (const character of source) {
    hash = (hash * 31 + character.charCodeAt(0)) % 10000;
  }

  return hash.toString().padStart(4, "0");
}

export function getPublicStudentId(
  fullName: string,
  sourceId: string,
  savedStudentId?: string | null,
): string {
  if (savedStudentId && savedStudentId.trim()) {
    return savedStudentId.trim().toUpperCase();
  }

  return `${getStudentIdInitials(fullName)}-${getStableFourDigitSuffix(sourceId)}`;
}
