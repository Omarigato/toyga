import pytest

@pytest.mark.asyncio
async def test_api_root_health(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data

@pytest.mark.asyncio
async def test_auth_register_and_login(client):
    register_payload = {
        "name": "Абылай Хан",
        "email": "abylai.test@toyga.kz",
        "password": "Password123!",
        "phone": "+77079998877"
    }
    res_reg = await client.post("/api/v1/auth/register", json=register_payload)
    assert res_reg.status_code == 200
    reg_data = res_reg.json()
    assert "access_token" in reg_data
    assert reg_data["name"] == "Абылай Хан"

    login_payload = {
        "email": "abylai.test@toyga.kz",
        "password": "Password123!"
    }
    res_login = await client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert "access_token" in login_data

@pytest.mark.asyncio
async def test_otp_flow(client):
    req_res = await client.post("/api/v1/auth/otp/request", json={"phone": "+77071112233"})
    assert req_res.status_code == 200
    assert "test_code" in req_res.json()

    verify_payload = {
        "phone": "+77071112233",
        "code": "123456",
        "name": "Асан Серік"
    }
    verify_res = await client.post("/api/v1/auth/otp/verify", json=verify_payload)
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert "access_token" in data
    assert data["name"] == "Асан Серік"
