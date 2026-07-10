import { google } from 'googleapis';

const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Handle newlines in private key securely
const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!clientEmail || !privateKey) {
    console.warn('Google Service Account credentials missing in .env');
}

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: clientEmail,
        private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export const drive = google.drive({ version: 'v3', auth });

export type MediaFolder =
    | 'templates/photos'
    | 'templates/videos'
    | 'templates/audios'
    | 'client/photos'
    | 'client/videos';

export function getFolderId(folder: MediaFolder): string {
    const map: Record<MediaFolder, string | undefined> = {
        'templates/photos': process.env.DRIVE_FOLDER_TEMPLATES_PHOTOS,
        'templates/videos': process.env.DRIVE_FOLDER_TEMPLATES_VIDEOS,
        'templates/audios': process.env.DRIVE_FOLDER_TEMPLATES_AUDIOS,
        'client/photos': process.env.DRIVE_FOLDER_CLIENT_PHOTOS,
        'client/videos': process.env.DRIVE_FOLDER_CLIENT_VIDEOS,
    };
    const id = map[folder];
    if (!id) throw new Error(`Google Drive folder ID missing for: ${folder}`);
    return id;
}
