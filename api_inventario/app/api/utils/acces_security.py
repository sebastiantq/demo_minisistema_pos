import secrets
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBasicCredentials, HTTPBasic

security = HTTPBasic()
API_CREDENTIALS_USERNAME = '' #os.getenv('API_CREDENTIALS_USERNAME')
API_CREDENTIALS_PASSWORD = '' #os.getenv('API_CREDENTIALS_PASSWORD')

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username,'jairo')
    correct_password = secrets.compare_digest(credentials.password, 'jairo') 
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Basic'},
        )
    return credentials.username
