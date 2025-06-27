from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'credentials.json'  # JSON-файл из Google Cloud Console

def grant_access(file_id, user_email):
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    permission = {
        'type': 'user',
        'role': 'reader',
        'emailAddress': user_email
    }

    service.permissions().create(
        fileId=file_id,
        body=permission,
        fields='id'
    ).execute()

    print(f'Доступ выдан {user_email} к файлу {file_id}')