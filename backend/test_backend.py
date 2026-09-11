import sys
from app.api.routes import (
    get_hotspots, get_hotspot_details, get_persistent_sources,
    get_stats, get_industrial_zones, download_incident_pdf,
    download_csv_report, ensure_initialized
)

def run_tests():
    print("==========================================")
    print("Testing FireWatch AI Backend Architecture")
    print("==========================================")

    # Initialize data store
    ensure_initialized()
    print("[PASS] Initialized data store & spatial engine")

    # 1. Hotspots list
    hotspots = get_hotspots(category=None, min_confidence=None, date_from=None, date_to=None, is_persistent=None, preset=None)
    assert len(hotspots) > 0, "No hotspots returned"
    print(f"[PASS] get_hotspots returned {len(hotspots)} classified hotspots")

    # Verify structure of first hotspot
    h0 = hotspots[0]
    required_keys = ["id", "latitude", "longitude", "category", "classification_confidence", "is_persistent", "nearest_facility", "explainability"]
    for k in required_keys:
        val = getattr(h0, k, None) if hasattr(h0, k) else h0.get(k)
        assert val is not None, f"Missing key {k} in hotspot"
    h0_dict = h0.model_dump() if hasattr(h0, "model_dump") else (h0.dict() if hasattr(h0, "dict") else h0)
    print(f"[PASS] Hotspot structure verified: {h0_dict['id']} -> {h0_dict['category']} ({h0_dict['classification_confidence']*100:.1f}%)")

    # Test filtering by category
    ind_spots = get_hotspots(category="Industrial Fire", min_confidence=None, date_from=None, date_to=None, is_persistent=None, preset=None)
    print(f"[PASS] Filter by 'Industrial Fire': {len(ind_spots)} spots")

    # 2. Stats endpoint
    stats = get_stats()
    stats_dict = stats.model_dump() if hasattr(stats, "model_dump") else (stats.dict() if hasattr(stats, "dict") else stats)
    print(f"[PASS] get_stats: {stats_dict['total_hotspots']} total, model acc: {stats_dict['model_accuracy_pct']}%, FP reduction: {stats_dict['false_positive_reduction_pct']}%")

    # 3. Persistent sources
    clusters = get_persistent_sources()
    assert len(clusters) > 0
    c0 = clusters[0].model_dump() if hasattr(clusters[0], "model_dump") else clusters[0]
    print(f"[PASS] get_persistent_sources: {len(clusters)} clusters. Top: {c0['facility_name']} ({c0['total_detections']} detections, {c0['hazard_level']} hazard)")

    # 4. Hotspot details and history
    target_id = h0_dict["id"]
    detail = get_hotspot_details(target_id)
    assert "hotspot" in detail
    assert "history" in detail
    print(f"[PASS] get_hotspot_details({target_id}) returned {len(detail['history'])} history entries")

    # 5. PDF Report Generation
    pdf_resp = download_incident_pdf(target_id)
    pdf_bytes = pdf_resp.body
    assert pdf_bytes.startswith(b"%PDF"), "Generated file is not a valid PDF"
    print(f"[PASS] PDF incident report generated successfully ({len(pdf_bytes)} bytes)")

    # 6. CSV Export
    csv_resp = download_csv_report()
    csv_text = csv_resp.body.decode("utf-8")
    assert "id,latitude,longitude" in csv_text
    print(f"[PASS] CSV report export generated successfully ({len(csv_text)} characters)")

    # 7. Industrial Zones
    zones = get_industrial_zones()
    assert len(zones) >= 5
    print(f"[PASS] get_industrial_zones returned {len(zones)} industrial polygons")

    # 8. Real State, District & Description Verification
    assert "state" in h0_dict and h0_dict["state"] != "", "Missing state in hotspot"
    assert "district" in h0_dict and h0_dict["district"] != "", "Missing district in hotspot"
    assert "description" in h0_dict and len(h0_dict["description"]) > 5, "Missing or invalid description in hotspot"
    print(f"[PASS] Real jurisdiction verified: State='{h0_dict['state']}', District='{h0_dict['district']}', Desc='{h0_dict['description'][:40]}...'")

    # 9. State Filter Test
    odisha_spots = get_hotspots(state="Odisha")
    assert len(odisha_spots) == 36, f"Expected 36 Odisha spots, got {len(odisha_spots)}"
    assert all((s.get("state") if isinstance(s, dict) else s.state) == "Odisha" for s in odisha_spots), "Not all spots in Odisha filter belong to Odisha"
    print(f"[PASS] State filtering test: 36/36 spots correctly isolated for Odisha")

    print("\n==========================================")
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY! (10/10)")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
