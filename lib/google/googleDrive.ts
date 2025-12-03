import { google } from "googleapis";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadToDrive(file: File, folderId: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // ---- File → Buffer → Stream ----
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = bufferToStream(buffer);

    const uploaded = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [folderId],
      },
      media: {
        mimeType: file.type,
        body: stream, // Stream, not buffer
      },
      fields: "id",
    });

    const final = await drive.files.get({
      fileId: uploaded.data.id!,
      fields: "id, name, webViewLink, webContentLink",
    });

    return final.data;
  } catch (err) {
    console.error("Google Drive upload error:", err);


    
    throw err;
  }
}




