/**
 * Progress photo storage — copies a picked photo into the app's documents
 * folder so it survives cache clean-ups, and removes it again on delete.
 * Falls back to the original URI wherever the file system isn't available.
 */
import { Directory, File, Paths } from "expo-file-system";

const FOLDER = "progress-photos";

export async function persistPhoto(uri) {
  try {
    const dir = new Directory(Paths.document, FOLDER);
    if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
    const extension = (uri.split("?")[0].split(".").pop() || "jpg").toLowerCase();
    const destination = new File(dir, `photo-${Date.now()}.${extension}`);
    await new File(uri).copy(destination);
    return destination.uri;
  } catch {
    return uri;
  }
}

export function deletePhoto(uri) {
  if (!uri) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Already gone, or not a file we own — nothing to clean up.
  }
}
