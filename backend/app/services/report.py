import io
import csv
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

class ReportGenerator:
    def generate_incident_pdf(self, hotspot: Dict[str, Any], history_points: List[Dict[str, Any]] = None) -> bytes:
        """
        Generates an official compliance & hazard incident report PDF for NTRO / Pollution Control Boards.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        header_title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#0f172a'),
            alignment=1
        )
        header_sub_style = ParagraphStyle(
            'HeaderSub',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569'),
            alignment=1
        )
        section_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=colors.HexColor('#1e293b'),
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'ReportBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#334155')
        )
        badge_style = ParagraphStyle(
            'BadgeStyle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=14,
            textColor=colors.white,
            alignment=1
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("SATELLITE THERMAL SURVEILLANCE &bull; INDUSTRIAL MONITORING COMMAND", header_sub_style))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("LALIFIREWATCH &mdash; THERMAL ANOMALY & INDUSTRIAL COMPLIANCE REPORT", header_title_style))
        elements.append(Paragraph("Automated Satellite Intelligence Dossier &bull; NASA FIRMS &times; OpenStreetMap Analytics", header_sub_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#0284c7'), spaceAfter=12))

        # 2. Classification Status Alert Box
        category = hotspot.get("category", "Unclassified")
        conf_pct = hotspot.get("classification_confidence", 0.0) * 100
        is_persistent = hotspot.get("is_persistent", False)

        badge_bg = colors.HexColor('#dc2626') if category == 'Industrial Fire' else \
                   colors.HexColor('#ea580c') if category == 'Persistent Thermal Source' else \
                   colors.HexColor('#d97706') if category == 'Agricultural Burn' else \
                   colors.HexColor('#059669') if category == 'Wildfire' else colors.HexColor('#475569')

        status_text = f"<b>FLAGGED STATUS: {category.upper()} &bull; ML CONFIDENCE: {conf_pct:.1f}%</b>"
        if is_persistent:
            status_text += " &bull; <b>PERSISTENT THERMAL SOURCE (&ge;3 DETECTIONS)</b>"

        status_table = Table(
            [[Paragraph(status_text, badge_style)]],
            colWidths=[540],
            rowHeights=[28]
        )
        status_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), badge_bg),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(status_table)
        elements.append(Spacer(1, 12))

        # 3. Incident Metadata Table
        elements.append(Paragraph("1. SATELLITE TELEMETRY & OBSERVATION PARAMETERS", section_style))
        
        near_fac = hotspot.get("nearest_facility", {}) or {}
        telemetry_data = [
            [
                Paragraph("<b>Incident Identifier:</b>", body_style), Paragraph(str(hotspot.get("id")), body_style),
                Paragraph("<b>Report Generated:</b>", body_style), Paragraph(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"), body_style)
            ],
            [
                Paragraph("<b>Coordinates (Lat, Lon):</b>", body_style), Paragraph(f"{hotspot.get('latitude', 0):.5f}&deg; N, {hotspot.get('longitude', 0):.5f}&deg; E", body_style),
                Paragraph("<b>Acquisition Time:</b>", body_style), Paragraph(f"{hotspot.get('acq_date')} {hotspot.get('acq_time')} hrs", body_style)
            ],
            [
                Paragraph("<b>Satellite & Sensor:</b>", body_style), Paragraph(f"{hotspot.get('satellite')} ({hotspot.get('instrument')})", body_style),
                Paragraph("<b>Day / Night Pass:</b>", body_style), Paragraph("Night-time Pass (Flaring Signature)" if hotspot.get("daynight") == "N" else "Daytime Solar Pass", body_style)
            ],
            [
                Paragraph("<b>Fire Radiative Power (FRP):</b>", body_style), Paragraph(f"<b>{hotspot.get('frp', 0):.1f} MW</b>", body_style),
                Paragraph("<b>Brightness Temperature:</b>", body_style), Paragraph(f"{hotspot.get('brightness', 0):.1f} K (Band I-4)", body_style)
            ],
            [
                Paragraph("<b>Satellite Raw Confidence:</b>", body_style), Paragraph(f"{hotspot.get('confidence', 0):.0f}%", body_style),
                Paragraph("<b>Persistence Cluster ID:</b>", body_style), Paragraph(str(hotspot.get("cluster_id") or "N/A"), body_style)
            ]
        ]
        t1 = Table(telemetry_data, colWidths=[135, 135, 135, 135])
        t1.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t1)
        elements.append(Spacer(1, 12))

        # 4. Infrastructure & OSM Cross-Reference
        elements.append(Paragraph("2. OPENSTREETMAP INFRASTRUCTURE & SPATIAL CORRELATION", section_style))
        facility_name = near_fac.get("name", "Unknown Facility")
        fac_dist = near_fac.get("distance_m", 0)
        fac_landuse = near_fac.get("landuse_type", "industrial")

        osm_data = [
            [
                Paragraph("<b>Matched Facility Name:</b>", body_style), Paragraph(f"<b>{facility_name}</b>", body_style),
                Paragraph("<b>Land-Use Category:</b>", body_style), Paragraph(f"{fac_landuse.upper()}", body_style)
            ],
            [
                Paragraph("<b>Distance to Perimeter:</b>", body_style), Paragraph(f"{int(fac_dist)} meters" if fac_dist > 0 else "<b>INSIDE INDUSTRIAL BOUNDARY (0m)</b>", body_style),
                Paragraph("<b>OSM Entity ID:</b>", body_style), Paragraph(str(near_fac.get("osm_id", "local_catalog")), body_style)
            ],
            [
                Paragraph("<b>30-Day Recurrence Count:</b>", body_style), Paragraph(f"<b>{hotspot.get('persistence_count_30d', 1)} detections</b> within 1.0 km", body_style),
                Paragraph("<b>Hazard Assessment:</b>", body_style), Paragraph("<b>ELEVATED REGULATORY PRIORITY</b>" if is_persistent else "STANDARD MONITORING", body_style)
            ]
        ]
        t2 = Table(osm_data, colWidths=[135, 135, 135, 135])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#94a3b8')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(t2)
        elements.append(Spacer(1, 12))

        # 5. Explainability Breakdown
        elements.append(Paragraph("3. AI CLASSIFICATION EXPLAINABILITY & FEATURE ATTRIBUTION", section_style))
        explain_items = hotspot.get("explainability", [])
        if explain_items:
            exp_table_data = [
                [Paragraph("<b>Key Signal Feature</b>", body_style), Paragraph("<b>Contribution</b>", body_style), Paragraph("<b>Physical Interpretation</b>", body_style)]
            ]
            for exp in explain_items:
                pct_str = f"{exp.get('importance_pct', 0):.0f}%"
                exp_table_data.append([
                    Paragraph(f"<b>{exp.get('feature')}</b>", body_style),
                    Paragraph(pct_str, body_style),
                    Paragraph(exp.get('description', ''), body_style)
                ])
            t3 = Table(exp_table_data, colWidths=[150, 80, 310])
            t3.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e2e8f0')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]))
            elements.append(t3)
        else:
            elements.append(Paragraph("No explainability metadata available for this point.", body_style))

        elements.append(Spacer(1, 14))

        # 6. Actionable Regulatory Recommendations
        elements.append(Paragraph("4. STATUTORY COMPLIANCE & ENFORCEMENT RECOMMENDATION", section_style))
        if category in ["Industrial Fire", "Persistent Thermal Source"]:
            rec_text = (
                "<b>MANDATORY GROUND INSPECTION RECOMMENDED:</b> This thermal anomaly strongly correlates with active industrial "
                f"operations at <b>{facility_name}</b>. Regional Pollution Control Authorities and Industrial Safety Inspectorates "
                "should dispatch a rapid ground-truth verification team to audit flare stack combustion efficiency, furnace integrity, "
                "or open-cast coal seam fire suppression measures under Section 21 of the Air (Prevention and Control of Pollution) Act."
            )
        elif category == "Agricultural Burn":
            rec_text = (
                "<b>AGRICULTURAL STUBBLE BURNING PROTOCOL:</b> Anomaly exhibits daytime crop residue burning characteristics. "
                "Notify District Agricultural Officers and local revenue authorities for geo-tagged farm inspection and CRM compliance."
            )
        elif category == "Wildfire":
            rec_text = (
                "<b>FOREST FIRE SUPPRESSION PROTOCOL:</b> High radiative output detected in forest cover. "
                "Alert nearest Forest Range Officers for beat patrol verification and fire break mobilization."
            )
        else:
            rec_text = "<b>CONTINUED SATELLITE SURVEILLANCE:</b> Maintain automated orbital tracking on subsequent MODIS/VIIRS overpasses."

        rec_table = Table([[Paragraph(rec_text, body_style)]], colWidths=[540])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef3c7')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#f59e0b')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(rec_table)
        elements.append(Spacer(1, 20))

        # 7. Official Sign-off
        signoff_data = [
            [
                Paragraph("<b>Automated System:</b> LaliFireWatch Platform v1.0", body_style),
                Paragraph("<b>Supervisory Review:</b> ___________________________", body_style)
            ],
            [
                Paragraph("<b>Protocol:</b> Autonomous Surveillance Standard", body_style),
                Paragraph("<b>Official Seal & Timestamp:</b> Verified Autonomous AI Run", body_style)
            ]
        ]
        t_sign = Table(signoff_data, colWidths=[270, 270])
        t_sign.setStyle(TableStyle([
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        elements.append(t_sign)

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    def generate_csv_report(self, hotspots: List[Dict[str, Any]]) -> str:
        """Generates CSV string export of classified hotspots."""
        output = io.StringIO()
        fieldnames = [
            "id", "latitude", "longitude", "acq_date", "acq_time",
            "satellite", "category", "classification_confidence",
            "is_persistent", "persistence_count_30d", "frp", "brightness",
            "confidence", "nearest_facility_name", "distance_to_facility_m"
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for spot in hotspots:
            near_fac = spot.get("nearest_facility") or {}
            writer.writerow({
                "id": spot.get("id"),
                "latitude": spot.get("latitude"),
                "longitude": spot.get("longitude"),
                "acq_date": spot.get("acq_date"),
                "acq_time": spot.get("acq_time"),
                "satellite": spot.get("satellite"),
                "category": spot.get("category"),
                "classification_confidence": spot.get("classification_confidence"),
                "is_persistent": spot.get("is_persistent"),
                "persistence_count_30d": spot.get("persistence_count_30d"),
                "frp": spot.get("frp"),
                "brightness": spot.get("brightness"),
                "confidence": spot.get("confidence"),
                "nearest_facility_name": near_fac.get("name", "N/A"),
                "distance_to_facility_m": near_fac.get("distance_m", "N/A")
            })
        return output.getvalue()

report_generator = ReportGenerator()
