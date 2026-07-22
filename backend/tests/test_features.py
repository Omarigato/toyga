import pytest

@pytest.mark.asyncio
async def test_templates_and_events_flow(client):
    # 1. List templates
    tmpl_res = await client.get("/api/v1/templates")
    assert tmpl_res.status_code == 200

    # 2. Guest invitation RSVP flow test
    guest_invite_res = await client.get("/api/v1/guests/invite/erzhan")
    # If not found in empty test DB, expect 404
    assert guest_invite_res.status_code in [200, 404]

    # 3. Admin stats endpoint
    stats_res = await client.get("/api/v1/admin/stats")
    assert stats_res.status_code == 200
    stats_data = stats_res.json()
    assert "total_users" in stats_data
    assert "total_events" in stats_data
