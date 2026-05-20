from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def do_test():
    resp1 = client.post('/api/v1/auth/login', json={'login_id':'ehteshamulhaque736','password':'123456789'})
    print('login_id status:', resp1.status_code)
    print(resp1.json())

    resp2 = client.post('/api/v1/auth/login', json={'email':'ehteshamulhaque736@gmail.com','password':'123456789'})
    print('email status:', resp2.status_code)
    print(resp2.json())

    resp3 = client.post('/api/v1/auth/login', json={'password':'123456789'})
    print('missing id status:', resp3.status_code)
    print(resp3.json())

    resp4 = client.post('/api/v1/auth/login', json={'login_id':'ehteshamulhaque736','password':'wrong'})
    print('wrong pw status:', resp4.status_code)
    print(resp4.json())

if __name__ == '__main__':
    do_test()
