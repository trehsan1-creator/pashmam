# Hardware Documentation - سامانه مدیریت ناوگان آتی‌فرزام

## Overview
Hardware components of the AtiFarzam Fleet Management System, including GPS trackers, sensors, and connectivity modules.

## Core Module Architecture

### Main Unit: Multi-Constellation GNSS & Industrial Telemetry

**Description:**
واحد موقعیت‌یاب چندسامانه‌ای GNSS و مخابرات صنعتی

**Specifications:**
- **Satellite Reception:** GPS / GLONASS (multi-channel)
- **Power Input:** 9V – 36V DC
- **Protection:** Surge-protected power circuit
- **Environmental:** IP65 rated (dust and moisture resistant)
- **Backup Power:** Internal backup battery for uninterrupted operation during power cuts

**Features:**
- High-sensitivity satellite receiver
- Resilient cellular modem
- Surge-protected power supply
- Safe, continuous operation across light and heavy fleets

## Hardware Modules

### 1. Signal Precision Module
**Title:** آنتن و ماژول مکان‌یابی دقیق

**Function:**
دریافت هم‌زمان سیگنال از چند منظومه ماهواره‌ای برای ثبت دقیق مختصات حتی در معابر متراکم و شرایط جوی مختلف

**Use Cases:**
- Urban canyons with dense buildings
- Adverse weather conditions
- Remote areas with weak signals

**Technical Details:**
- Multi-constellation support (GPS + GLONASS)
- High-precision coordinate logging
- Real-time position updates

---

### 2. Offline Storage Module
**Title:** ذخیره‌سازی آفلاین در نقاط کور

**Function:**
ثبت خودکار هزاران نقطه حرکتی در مناطق فاقد پوشش شبکه موبایل و ارسال یکپارچه اطلاعات بلافاصله پس از اتصال مجدد

**Capacity:**
- Thousands of waypoints
- Multiple days of offline data
- Automatic synchronization upon reconnection

**Use Cases:**
- Remote areas without cellular coverage
- Tunnels and underground parking
- Network outages

---

### 3. I/O Expansion Module
**Title:** پشتیبانی از سنسورها و ورودی‌های جانبی

**Function:**
قابلیت اتصال به ورودی سوئیچ (ACC)، سنسورهای دما و درب، تشخیص ضربه یا لرزش و رله فرمان ایمن از راه دور

**Supported Inputs:**
- Ignition detection (ACC)
- Temperature sensors
- Door sensors (open/close)
- Shock/vibration detection
- Remote relay control

**Connections:**
- Digital inputs
- Analog inputs
- Relay outputs
- CAN bus interface (where applicable)

---

### 4. Circuit Safety Module
**Title:** باتری داخلی و هشدار جداسازی

**Function:**
تشخیص فوری قطع برق اصلی یا دستکاری دستگاه و ارسال هشدار اضطراری به سامانه مرکزی به کمک باتری پشتیبان داخلی

**Features:**
- Main power disconnection detection
- Physical tampering detection
- Emergency alert dispatch via internal battery
- Tamper-proof enclosure options

**Battery:**
- Rechargeable backup battery
- Automatic switching during power loss
- Extended operation time
- Low battery alerts

## Installation Requirements

### Physical Installation
- Compact form factor for vehicle mounting
- Weatherproof housing (IP65)
- Vibration-resistant mounting
- Hidden installation options for security

### Electrical Installation
- Wide voltage range: 9V–36V DC
- Reverse polarity protection
- Over-voltage protection
- Power surge suppression

### Antenna Placement
- Clear view of sky
- Away from metal obstructions
- Proper grounding
- Weatherproof connections

## Hardware Compatibility

### Supported Tracker Models
*(To be populated based on specific device specifications)*

### Sensor Compatibility Matrix
| Sensor Type | Supported | Notes |
|------------|----------|-------|
| Temperature | ✅ | Internal or external |
| Fuel Level | ✅ | Requires compatible fuel sensor |
| Door Status | ✅ | Digital input |
| Ignition | ✅ | ACC detection |
| Motion/Shock | ✅ | Built-in or external |
| Voltage | ✅ | Power telemetry |

## Maintenance and Troubleshooting

### Regular Maintenance
- Periodic signal strength checks
- Battery health monitoring
- Firmware updates
- Physical inspection for damage

### Common Issues
- **No GPS Signal:** Check antenna connection, clear sky view
- **No Cellular Connection:** Check SIM card, network coverage
- **Power Issues:** Check vehicle power supply, fuse
- **Data Not Sending:** Check cellular signal, data plan

### Diagnostic Indicators
- LED status lights
- Self-test mode
- Remote diagnostic commands
- Mobile app diagnostics

## Hardware Security Features

### Anti-Tampering
- Tamper detection sensors
- Automatic alerts on unauthorized access
- Secure mounting options
- Hidden installation recommended

### Data Protection
- Encrypted data transmission
- Secure authentication
- Data integrity checks
- Privacy compliance

### Physical Security
- Tamper-proof enclosure
- Security screws
- Alarm on removal
- Geofence-based security alerts
