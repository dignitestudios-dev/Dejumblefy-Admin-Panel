/**
 * Formats API and validation error messages to be user-friendly,
 * stripping internal API field names and transforming them into readable text.
 */
export function formatErrorMessage(err: unknown, defaultMessage = "An unexpected error occurred."): string {
  if (!err) return defaultMessage;

  let rawMessage: string | string[] = "";

  if (typeof err === "string") {
    rawMessage = err;
  } else if (typeof err === "object" && err !== null) {
    const errorObj = err as {
      response?: {
        data?: {
          message?: string | string[];
          error?: string;
          errors?: Record<string, string[]> | string[] | Array<{ field?: string; message?: string }>;
        };
      };
      message?: string;
    };

    const data = errorObj.response?.data;
    if (data?.message) {
      rawMessage = data.message;
    } else if (data?.errors) {
      if (Array.isArray(data.errors)) {
        const first = data.errors[0];
        if (typeof first === "string") {
          rawMessage = first;
        } else if (first && typeof first === "object" && "message" in first) {
          rawMessage = (first as { message: string }).message;
        }
      } else if (typeof data.errors === "object") {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey && Array.isArray(data.errors[firstKey]) && data.errors[firstKey][0]) {
          rawMessage = data.errors[firstKey][0];
        }
      }
    } else if (data?.error) {
      rawMessage = data.error;
    } else if (errorObj.message) {
      rawMessage = errorObj.message;
    }
  }

  if (Array.isArray(rawMessage)) {
    rawMessage = rawMessage[0] || "";
  }

  if (!rawMessage || typeof rawMessage !== "string") {
    return defaultMessage;
  }

  // Strip prefixes like "data.", "body.", "params."
  let clean = rawMessage.replace(/^(data|body|params|query)\./i, "");

  // Transform common technical API field name patterns into user-friendly messages
  const fieldReplacements: Array<[RegExp, string]> = [
    [/newPassword must be longer than or equal to (\d+) characters/i, "New password must be at least $1 characters"],
    [/password must be longer than or equal to (\d+) characters/i, "Password must be at least $1 characters"],
    [/currentPassword must be longer than or equal to (\d+) characters/i, "Current password must be at least $1 characters"],
    [/newPassword must be shorter than or equal to (\d+) characters/i, "New password cannot exceed $1 characters"],
    [/password must be shorter than or equal to (\d+) characters/i, "Password cannot exceed $1 characters"],
    [/currentPassword must be shorter than or equal to (\d+) characters/i, "Current password cannot exceed $1 characters"],
    [/newPassword should not be empty/i, "New password is required"],
    [/currentPassword should not be empty/i, "Current password is required"],
    [/confirmPassword should not be empty/i, "Confirm password is required"],
    [/password should not be empty/i, "Password is required"],
    [/email should not be empty/i, "Email is required"],
    [/email must be an email/i, "Please enter a valid email address"],
    [/resetToken/gi, "Reset token"],
    [/currentPassword/gi, "Current password"],
    [/newPassword/gi, "New password"],
    [/confirmPassword/gi, "Confirm password"],
  ];

  for (const [pattern, replacement] of fieldReplacements) {
    clean = clean.replace(pattern, replacement);
  }

  // Capitalize first character if it's lowercase
  if (clean.length > 0) {
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  return clean;
}
