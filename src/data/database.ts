// Mock database of devices, their component parts, and possible projects

export interface Component {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  estimatedValue: number;
  tags: string[];
}

export interface Device {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  components: string[]; // component IDs
  image: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  requiredParts: string[]; // component IDs
  optionalParts: string[];
  category: string;
  icon: string;
  image: string;
  instructions: string[];
  communityRating: number;
  timesBuilt: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  location: { lat: number; lng: number };
  parts: string[]; // component IDs they have
  wants: string[]; // components they're looking for
  bio: string;
  tradesOpen: boolean;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'trade_offer' | 'part_request';
}

// COMPONENTS DATABASE
export const components: Component[] = [
  { id: 'motor_dc', name: 'DC Motor', category: 'Motors & Actuators', icon: '⚙️', description: 'Small brushed DC motor, 3-12V', rarity: 'common', estimatedValue: 2, tags: ['motion', 'power', 'rotation'] },
  { id: 'motor_stepper', name: 'Stepper Motor', category: 'Motors & Actuators', icon: '🔄', description: 'Bipolar stepper motor, 1.8° step angle', rarity: 'uncommon', estimatedValue: 8, tags: ['precision', 'motion', 'rotation'] },
  { id: 'servo', name: 'Micro Servo', category: 'Motors & Actuators', icon: '🦾', description: '9g micro servo motor', rarity: 'common', estimatedValue: 3, tags: ['motion', 'control', 'robotics'] },
  { id: 'solenoid', name: 'Solenoid', category: 'Motors & Actuators', icon: '🔌', description: '12V push-pull solenoid', rarity: 'uncommon', estimatedValue: 5, tags: ['motion', 'linear', 'locking'] },
  { id: 'led_red', name: 'Red LED (5mm)', category: 'Lighting', icon: '🔴', description: 'Standard 5mm red LED', rarity: 'common', estimatedValue: 0.1, tags: ['light', 'indicator', 'display'] },
  { id: 'led_rgb', name: 'RGB LED Strip', category: 'Lighting', icon: '🌈', description: 'WS2812B addressable LED strip, 1m', rarity: 'uncommon', estimatedValue: 6, tags: ['light', 'display', 'color', 'decoration'] },
  { id: 'lcd_screen', name: 'LCD Display 16x2', category: 'Displays', icon: '📟', description: '16x2 character LCD with I2C backpack', rarity: 'common', estimatedValue: 4, tags: ['display', 'text', 'interface'] },
  { id: 'oled_screen', name: 'OLED Display 0.96"', category: 'Displays', icon: '📱', description: '0.96" 128x64 OLED display, I2C', rarity: 'uncommon', estimatedValue: 7, tags: ['display', 'graphics', 'interface'] },
  { id: 'tft_screen', name: 'TFT Touchscreen 2.4"', category: 'Displays', icon: '📺', description: '2.4" TFT LCD with resistive touch', rarity: 'rare', estimatedValue: 15, tags: ['display', 'touch', 'interface', 'graphics'] },
  { id: 'arduino_nano', name: 'Arduino Nano', category: 'Microcontrollers', icon: '🧠', description: 'ATmega328P based microcontroller board', rarity: 'common', estimatedValue: 5, tags: ['brain', 'controller', 'programmable'] },
  { id: 'esp32', name: 'ESP32 Dev Board', category: 'Microcontrollers', icon: '📡', description: 'WiFi + Bluetooth enabled microcontroller', rarity: 'uncommon', estimatedValue: 8, tags: ['brain', 'wifi', 'bluetooth', 'iot'] },
  { id: 'raspberry_pi', name: 'Raspberry Pi Zero', category: 'Single Board Computers', icon: '🍓', description: 'Raspberry Pi Zero W with WiFi', rarity: 'rare', estimatedValue: 15, tags: ['computer', 'linux', 'powerful', 'wifi'] },
  { id: 'resistor_kit', name: 'Resistor Kit', category: 'Passive Components', icon: '〰️', description: 'Assorted resistors 220Ω-1MΩ', rarity: 'common', estimatedValue: 3, tags: ['passive', 'resistance', 'basics'] },
  { id: 'capacitor_kit', name: 'Capacitor Kit', category: 'Passive Components', icon: '⚡', description: 'Assorted electrolytic & ceramic caps', rarity: 'common', estimatedValue: 3, tags: ['passive', 'storage', 'filtering'] },
  { id: 'transistor_npn', name: 'NPN Transistors (x10)', category: 'Semiconductors', icon: '🔀', description: '2N2222 NPN general purpose transistors', rarity: 'common', estimatedValue: 2, tags: ['switching', 'amplification', 'semiconductor'] },
  { id: 'mosfet', name: 'MOSFET IRF520', category: 'Semiconductors', icon: '⚡', description: 'N-channel MOSFET for power switching', rarity: 'common', estimatedValue: 1, tags: ['power', 'switching', 'motor_control'] },
  { id: 'relay_module', name: 'Relay Module 4-ch', category: 'Switching', icon: '🔁', description: '4-channel 5V relay module', rarity: 'common', estimatedValue: 4, tags: ['switching', 'high_power', 'control'] },
  { id: 'buck_converter', name: 'Buck Converter Module', category: 'Power', icon: '🔋', description: 'LM2596 step-down converter module', rarity: 'common', estimatedValue: 3, tags: ['power', 'voltage', 'regulation'] },
  { id: 'lipo_battery', name: 'LiPo Battery 3.7V 2000mAh', category: 'Power', icon: '🔋', description: 'Rechargeable lithium polymer battery', rarity: 'uncommon', estimatedValue: 6, tags: ['power', 'portable', 'rechargeable'] },
  { id: 'solar_panel', name: 'Mini Solar Panel 5V', category: 'Power', icon: '☀️', description: '5V 200mA mini solar panel', rarity: 'uncommon', estimatedValue: 5, tags: ['power', 'solar', 'renewable', 'outdoor'] },
  { id: 'speaker', name: 'Piezo Buzzer', category: 'Audio', icon: '🔊', description: 'Active piezo buzzer module', rarity: 'common', estimatedValue: 1, tags: ['sound', 'alert', 'audio'] },
  { id: 'mp3_module', name: 'MP3 Player Module', category: 'Audio', icon: '🎵', description: 'DFPlayer Mini MP3 module with SD card', rarity: 'uncommon', estimatedValue: 5, tags: ['sound', 'music', 'audio', 'playback'] },
  { id: 'microphone', name: 'Sound Sensor Module', category: 'Sensors', icon: '🎤', description: 'Analog sound detection module', rarity: 'common', estimatedValue: 2, tags: ['sensor', 'sound', 'input'] },
  { id: 'pir_sensor', name: 'PIR Motion Sensor', category: 'Sensors', icon: '👁️', description: 'HC-SR501 passive infrared motion sensor', rarity: 'common', estimatedValue: 2, tags: ['sensor', 'motion', 'security', 'input'] },
  { id: 'ultrasonic', name: 'Ultrasonic Sensor', category: 'Sensors', icon: '📏', description: 'HC-SR04 ultrasonic distance sensor', rarity: 'common', estimatedValue: 2, tags: ['sensor', 'distance', 'measurement'] },
  { id: 'temp_sensor', name: 'DHT22 Temp/Humidity', category: 'Sensors', icon: '🌡️', description: 'Digital temperature and humidity sensor', rarity: 'common', estimatedValue: 4, tags: ['sensor', 'temperature', 'humidity', 'weather'] },
  { id: 'camera_module', name: 'Camera Module OV7670', category: 'Sensors', icon: '📷', description: 'VGA camera module for microcontrollers', rarity: 'rare', estimatedValue: 10, tags: ['vision', 'camera', 'image', 'sensor'] },
  { id: 'gps_module', name: 'GPS Module NEO-6M', category: 'Communication', icon: '🛰️', description: 'GPS receiver module with antenna', rarity: 'uncommon', estimatedValue: 8, tags: ['location', 'navigation', 'gps'] },
  { id: 'lora_module', name: 'LoRa Radio Module', category: 'Communication', icon: '📻', description: 'SX1278 LoRa 433MHz radio module', rarity: 'rare', estimatedValue: 12, tags: ['communication', 'long_range', 'radio', 'iot'] },
  { id: 'nfc_module', name: 'NFC/RFID Reader', category: 'Communication', icon: '💳', description: 'RC522 13.56MHz RFID reader module', rarity: 'common', estimatedValue: 4, tags: ['rfid', 'nfc', 'access', 'identification'] },
  { id: 'aluminum_sheet', name: 'Aluminum Sheet', category: 'Structural', icon: '🪙', description: 'Thin aluminum sheet 10x10cm', rarity: 'common', estimatedValue: 2, tags: ['structure', 'metal', 'enclosure', 'frame'] },
  { id: '3d_printed_case', name: '3D Printed Enclosure', category: 'Structural', icon: '📦', description: 'Generic project enclosure, customizable', rarity: 'common', estimatedValue: 3, tags: ['structure', 'enclosure', 'protection'] },
  { id: 'pcb_blank', name: 'Perfboard/Proto Board', category: 'Structural', icon: '🟩', description: 'Double-sided perfboard 7x5cm', rarity: 'common', estimatedValue: 1, tags: ['pcb', 'prototyping', 'circuit'] },
  { id: 'wire_kit', name: 'Jumper Wire Kit', category: 'Connectivity', icon: '🔗', description: 'Male-female, male-male, female-female dupont wires', rarity: 'common', estimatedValue: 3, tags: ['wiring', 'connection', 'prototyping'] },
  { id: 'usb_cable', name: 'USB Cable & Connector', category: 'Connectivity', icon: '🔌', description: 'USB-A to micro-USB cable', rarity: 'common', estimatedValue: 1, tags: ['power', 'data', 'usb', 'connection'] },
  { id: 'fan', name: '40mm Cooling Fan', category: 'Mechanical', icon: '🌀', description: '5V 40x40mm brushless cooling fan', rarity: 'common', estimatedValue: 2, tags: ['cooling', 'air', 'ventilation'] },
  { id: 'heatsink', name: 'Aluminum Heatsink Set', category: 'Mechanical', icon: '🧊', description: 'Assorted aluminum heatsinks', rarity: 'common', estimatedValue: 2, tags: ['cooling', 'thermal', 'dissipation'] },
  { id: 'gear_set', name: 'Plastic Gear Set', category: 'Mechanical', icon: '⚙️', description: 'Assorted spur gears, various sizes', rarity: 'uncommon', estimatedValue: 4, tags: ['mechanical', 'transmission', 'motion'] },
  { id: 'bearing_set', name: 'Ball Bearing Set', category: 'Mechanical', icon: '🔵', description: 'Assorted ball bearings 608, 625, 623', rarity: 'common', estimatedValue: 3, tags: ['mechanical', 'rotation', 'friction'] },
  { id: 'spring_set', name: 'Spring Assortment', category: 'Mechanical', icon: '🔩', description: 'Various compression and extension springs', rarity: 'common', estimatedValue: 2, tags: ['mechanical', 'elastic', 'return'] },
  { id: 'switch_button', name: 'Push Button Set', category: 'Input', icon: '🔘', description: 'Assorted tactile push buttons', rarity: 'common', estimatedValue: 1, tags: ['input', 'control', 'interface'] },
  { id: 'rotary_encoder', name: 'Rotary Encoder', category: 'Input', icon: '🎛️', description: 'Rotary encoder with push button', rarity: 'common', estimatedValue: 2, tags: ['input', 'rotation', 'control', 'knob'] },
  { id: 'joystick', name: 'Analog Joystick Module', category: 'Input', icon: '🕹️', description: 'Dual-axis analog joystick with button', rarity: 'common', estimatedValue: 2, tags: ['input', 'control', 'gaming', 'direction'] },
  { id: 'keyboard_matrix', name: 'Keypad 4x4 Matrix', category: 'Input', icon: '🔢', description: '4x4 membrane keypad matrix', rarity: 'common', estimatedValue: 2, tags: ['input', 'keys', 'code', 'interface'] },
  { id: 'ir_remote', name: 'IR Remote + Receiver', category: 'Input', icon: '📡', description: 'IR remote control with receiver module', rarity: 'common', estimatedValue: 2, tags: ['input', 'wireless', 'control', 'remote'] },
  { id: 'wifi_camera', name: 'ESP32-CAM', category: 'Cameras', icon: '📸', description: 'ESP32 with camera module, WiFi streaming', rarity: 'uncommon', estimatedValue: 10, tags: ['camera', 'wifi', 'streaming', 'security'] },
  { id: 'sd_card', name: 'MicroSD Card Module', category: 'Storage', icon: '💾', description: 'MicroSD card reader/writer module', rarity: 'common', estimatedValue: 2, tags: ['storage', 'data', 'logging'] },
  { id: 'rtc_module', name: 'RTC Module DS3231', category: 'Timing', icon: '⏰', description: 'High precision real-time clock module', rarity: 'common', estimatedValue: 3, tags: ['time', 'clock', 'scheduling', 'logging'] },
];

// DEVICES DATABASE - things you might find scanning
export const devices: Device[] = [
  {
    id: 'old_printer',
    name: 'Old Inkjet Printer',
    type: 'Office Equipment',
    icon: '🖨️',
    description: 'End-of-life inkjet printer. Goldmine of parts!',
    components: ['motor_stepper', 'motor_dc', 'bearing_set', 'gear_set', 'pcb_blank', 'wire_kit', 'resistor_kit', 'aluminum_sheet', 'usb_cable'],
    image: '🖨️'
  },
  {
    id: 'broken_laptop',
    name: 'Broken Laptop',
    type: 'Computer',
    icon: '💻',
    description: 'Dead motherboard but plenty of salvageable parts',
    components: ['lipo_battery', 'fan', 'heatsink', 'speaker', 'lcd_screen', 'wifi_camera', 'usb_cable', 'resistor_kit', 'capacitor_kit', 'sd_card'],
    image: '💻'
  },
  {
    id: 'microwave',
    name: 'Broken Microwave',
    type: 'Appliance',
    icon: '📦',
    description: 'CAUTION: High voltage capacitor! But lots of useful parts',
    components: ['motor_dc', 'relay_module', 'lcd_screen', 'switch_button', 'buck_converter', 'aluminum_sheet', 'fan', 'wire_kit', 'led_red'],
    image: '📦'
  },
  {
    id: 'old_phone',
    name: 'Old Smartphone',
    type: 'Electronics',
    icon: '📱',
    description: 'Cracked screen phone - sensors and battery still good',
    components: ['lipo_battery', 'camera_module', 'speaker', 'oled_screen', 'gps_module', 'microphone', 'usb_cable'],
    image: '📱'
  },
  {
    id: 'toy_car',
    name: 'RC Toy Car',
    type: 'Toy',
    icon: '🚗',
    description: 'Broken RC car with working motors and electronics',
    components: ['motor_dc', 'gear_set', 'bearing_set', 'ir_remote', 'switch_button', 'led_red', 'speaker', 'lipo_battery', 'spring_set'],
    image: '🚗'
  },
  {
    id: 'dvd_player',
    name: 'Broken DVD Player',
    type: 'Electronics',
    icon: '💿',
    description: 'Precision mechanics and optical components inside',
    components: ['motor_stepper', 'motor_dc', 'led_red', 'laser_module' as any, 'oled_screen', 'pcb_blank', 'resistor_kit', 'capacitor_kit', 'usb_cable', 'bearing_set'],
    image: '💿'
  },
  {
    id: 'old_router',
    name: 'WiFi Router',
    type: 'Networking',
    icon: '📡',
    description: 'Old router with useful wireless components',
    components: ['esp32', 'resistor_kit', 'capacitor_kit', 'usb_cable', 'led_red', 'aluminum_sheet'],
    image: '📡'
  },
  {
    id: 'game_console',
    name: 'Broken Game Console',
    type: 'Gaming',
    icon: '🎮',
    description: 'Dead console but controllers and internals are great',
    components: ['joystick', 'switch_button', 'speaker', 'raspberry_pi', 'lipo_battery', 'oled_screen', 'usb_cable', 'fan'],
    image: '🎮'
  },
  {
    id: 'washing_machine',
    name: 'Washing Machine Parts',
    type: 'Appliance',
    icon: '🫧',
    description: 'Salvaged parts from a dead washing machine',
    components: ['motor_dc', 'relay_module', 'temp_sensor', 'switch_button', 'aluminum_sheet', 'bearing_set', 'spring_set', 'wire_kit', 'buck_converter'],
    image: '🫧'
  },
  {
    id: 'drone_broken',
    name: 'Crashed Drone',
    type: 'RC/Hobby',
    icon: '🚁',
    description: 'Crashed drone - motors and camera still work',
    components: ['motor_dc', 'camera_module', 'lipo_battery', 'gps_module', 'esp32', 'led_rgb', 'bearing_set'],
    image: '🚁'
  },
  {
    id: 'vending_machine',
    name: 'Vending Machine Control Board',
    type: 'Commercial',
    icon: '🏪',
    description: 'Salvaged control system from a vending machine',
    components: ['arduino_nano', 'lcd_screen', 'switch_button', 'relay_module', 'nfc_module', 'solenoid', 'motor_dc', 'led_red', 'wire_kit', 'resistor_kit'],
    image: '🏪'
  },
  {
    id: 'security_camera',
    name: 'Old Security Camera',
    type: 'Security',
    icon: '🎥',
    description: 'Wired security camera with IR LEDs and motor',
    components: ['camera_module', 'motor_stepper', 'led_rgb', 'buck_converter', 'usb_cable', 'aluminum_sheet', 'resistor_kit'],
    image: '🎥'
  },
];

// PROJECTS DATABASE - things you can build
export const projects: Project[] = [
  {
    id: 'weather_station',
    name: 'IoT Weather Station',
    description: 'WiFi-connected weather station with OLED display showing temperature, humidity, and forecasts',
    difficulty: 'medium',
    requiredParts: ['esp32', 'temp_sensor', 'oled_screen', 'buck_converter', 'lipo_battery', 'solar_panel', '3d_printed_case'],
    optionalParts: ['led_rgb', 'sd_card', 'rtc_module'],
    category: 'IoT & Smart Home',
    icon: '🌤️',
    image: '🌤️',
    instructions: ['Flash ESP32 with weather firmware', 'Connect DHT22 to GPIO pins', 'Wire OLED via I2C', 'Add solar charging circuit', 'Upload to cloud dashboard'],
    communityRating: 4.7,
    timesBuilt: 234
  },
  {
    id: 'robot_arm',
    name: 'Desktop Robot Arm',
    description: '4-DOF robot arm controlled via joystick or web interface',
    difficulty: 'hard',
    requiredParts: ['arduino_nano', 'servo', 'servo', 'servo', 'servo', 'joystick', 'aluminum_sheet', 'gear_set', 'wire_kit', 'buck_converter'],
    optionalParts: ['camera_module', 'lcd_screen', 'rotary_encoder'],
    category: 'Robotics',
    icon: '🦾',
    image: '🦾',
    instructions: ['Cut aluminum for arm segments', 'Mount servos at joints', 'Wire joystick for control', 'Program inverse kinematics', 'Add gripper mechanism'],
    communityRating: 4.5,
    timesBuilt: 89
  },
  {
    id: 'smart_lock',
    name: 'RFID Smart Lock',
    description: 'Electronic door lock with RFID access, keypad backup, and logging',
    difficulty: 'medium',
    requiredParts: ['arduino_nano', 'nfc_module', 'solenoid', 'keyboard_matrix', 'lcd_screen', 'relay_module', 'resistor_kit', 'wire_kit'],
    optionalParts: ['esp32', 'speaker', 'led_rgb', 'rtc_module'],
    category: 'Security',
    icon: '🔐',
    image: '🔐',
    instructions: ['Program RFID tag registration', 'Wire solenoid through relay', 'Connect keypad for PIN backup', 'Mount LCD for status display', 'Install on door frame'],
    communityRating: 4.3,
    timesBuilt: 156
  },
  {
    id: 'led_matrix',
    name: 'WiFi LED Matrix Display',
    description: 'Addressable LED matrix with WiFi-controlled patterns and animations',
    difficulty: 'easy',
    requiredParts: ['esp32', 'led_rgb', 'buck_converter', 'wire_kit', 'aluminum_sheet'],
    optionalParts: ['microphone', 'switch_button', 'rotary_encoder'],
    category: 'Art & Decoration',
    icon: '✨',
    image: '✨',
    instructions: ['Arrange LED strip in matrix pattern', 'Wire to ESP32 with level shifter', 'Flash with WLED firmware', 'Connect to WiFi', 'Control via phone app'],
    communityRating: 4.8,
    timesBuilt: 412
  },
  {
    id: 'plant_monitor',
    name: 'Smart Plant Monitor',
    description: 'Monitors soil moisture, light, and temperature. Sends alerts when your plant needs attention',
    difficulty: 'easy',
    requiredParts: ['esp32', 'temp_sensor', 'resistor_kit', 'lipo_battery', 'solar_panel', 'oled_screen'],
    optionalParts: ['led_rgb', 'speaker', '3d_printed_case'],
    category: 'IoT & Smart Home',
    icon: '🌱',
    image: '🌱',
    instructions: ['Build moisture sensor probes', 'Connect sensors to ESP32', 'Program threshold alerts', 'Add OLED for local display', 'Set up WiFi notifications'],
    communityRating: 4.6,
    timesBuilt: 298
  },
  {
    id: 'motion_alarm',
    name: 'Wireless Motion Alarm',
    description: 'PIR-triggered alarm with LoRa long-range notification and camera capture',
    difficulty: 'medium',
    requiredParts: ['esp32', 'pir_sensor', 'speaker', 'led_rgb', 'lora_module', 'lipo_battery', '3d_printed_case'],
    optionalParts: ['camera_module', 'gps_module', 'solar_panel'],
    category: 'Security',
    icon: '🚨',
    image: '🚨',
    instructions: ['Mount PIR sensor in enclosure', 'Wire alarm buzzer and LEDs', 'Add LoRa for remote notification', 'Program detection patterns', 'Install at entry points'],
    communityRating: 4.2,
    timesBuilt: 167
  },
  {
    id: 'music_box',
    name: 'Digital Music Box',
    description: 'MP3 player with buttons, display, and amplifier in a custom enclosure',
    difficulty: 'easy',
    requiredParts: ['arduino_nano', 'mp3_module', 'speaker', 'switch_button', 'sd_card', 'lipo_battery', '3d_printed_case'],
    optionalParts: ['oled_screen', 'rotary_encoder', 'led_rgb'],
    category: 'Audio',
    icon: '🎶',
    image: '🎶',
    instructions: ['Load MP3 files to SD card', 'Wire DFPlayer to Arduino', 'Add button controls', 'Connect speaker amplifier', 'Design and print enclosure'],
    communityRating: 4.4,
    timesBuilt: 189
  },
  {
    id: 'cnc_plotter',
    name: 'Mini CNC Plotter',
    description: 'Small drawing robot using stepper motors from old printers',
    difficulty: 'expert',
    requiredParts: ['arduino_nano', 'motor_stepper', 'motor_stepper', 'gear_set', 'bearing_set', 'aluminum_sheet', 'resistor_kit', 'wire_kit', 'buck_converter'],
    optionalParts: ['servo', 'lcd_screen', 'switch_button'],
    category: 'Robotics',
    icon: '✏️',
    image: '✏️',
    instructions: ['Build frame from aluminum', 'Mount stepper motors on rails', 'Wire motor drivers', 'Flash GRBL firmware', 'Calibrate and draw!'],
    communityRating: 4.9,
    timesBuilt: 56
  },
  {
    id: 'smart_mirror',
    name: 'Smart Mirror Display',
    description: 'Magic mirror with time, weather, and notifications behind reflective glass',
    difficulty: 'hard',
    requiredParts: ['raspberry_pi', 'tft_screen', 'aluminum_sheet', 'usb_cable', 'buck_converter', 'wire_kit'],
    optionalParts: ['camera_module', 'pir_sensor', 'microphone', 'temp_sensor'],
    category: 'IoT & Smart Home',
    icon: '🪞',
    image: '🪞',
    instructions: ['Build frame for mirror', 'Mount display behind two-way mirror', 'Install Raspberry Pi', 'Configure MagicMirror² software', 'Add modules for weather, calendar, etc.'],
    communityRating: 4.7,
    timesBuilt: 143
  },
  {
    id: 'pet_feeder',
    name: 'Automatic Pet Feeder',
    description: 'Timed pet feeder with portion control and remote monitoring',
    difficulty: 'medium',
    requiredParts: ['esp32', 'motor_stepper', 'rtc_module', 'relay_module', 'lipo_battery', 'solar_panel', '3d_printed_case', 'gear_set'],
    optionalParts: ['camera_module', 'oled_screen', 'speaker', 'pir_sensor'],
    category: 'IoT & Smart Home',
    icon: '🐾',
    image: '🐾',
    instructions: ['Design hopper mechanism', 'Mount stepper for auger', 'Program RTC schedules', 'Add WiFi for remote control', 'Test portion accuracy'],
    communityRating: 4.5,
    timesBuilt: 98
  },
  {
    id: 'retro_game',
    name: 'Handheld Retro Game Console',
    description: 'Build your own Game Boy-style console with classic games',
    difficulty: 'hard',
    requiredParts: ['arduino_nano', 'oled_screen', 'joystick', 'switch_button', 'speaker', 'lipo_battery', 'pcb_blank', '3d_printed_case'],
    optionalParts: ['led_rgb', 'rotary_encoder', 'buck_converter'],
    category: 'Gaming',
    icon: '🎮',
    image: '🎮',
    instructions: ['Flash game engine firmware', 'Wire OLED display', 'Connect joystick and buttons', 'Add audio output', 'Design and print case'],
    communityRating: 4.8,
    timesBuilt: 267
  },
  {
    id: 'air_quality',
    name: 'Air Quality Monitor',
    description: 'Monitor CO2, VOC, particulates with data logging and alerts',
    difficulty: 'medium',
    requiredParts: ['esp32', 'temp_sensor', 'oled_screen', 'sd_card', 'led_rgb', 'buck_converter', 'lipo_battery', '3d_printed_case'],
    optionalParts: ['lora_module', 'gps_module', 'solar_panel', 'rtc_module'],
    category: 'IoT & Smart Home',
    icon: '💨',
    image: '💨',
    instructions: ['Connect air quality sensors', 'Program data logging to SD', 'Set up OLED dashboard', 'Configure WiFi data upload', 'Add LED status indicators'],
    communityRating: 4.4,
    timesBuilt: 134
  },
];

// MOCK USER PROFILES (community)
export const communityUsers: UserProfile[] = [
  {
    id: 'user1',
    username: 'JunkYardKing',
    avatar: '👑',
    level: 42,
    xp: 8750,
    location: { lat: 40.7128, lng: -74.006 },
    parts: ['motor_dc', 'motor_stepper', 'servo', 'arduino_nano', 'esp32', 'led_rgb', 'oled_screen', 'pir_sensor', 'temp_sensor', 'aluminum_sheet', 'gear_set', 'bearing_set'],
    wants: ['raspberry_pi', 'camera_module', 'lora_module'],
    bio: 'Scavenger supreme. If it has circuits, I want it.',
    tradesOpen: true,
    online: true,
  },
  {
    id: 'user2',
    username: 'CircuitWitch',
    avatar: '🧙‍♀️',
    level: 28,
    xp: 5200,
    location: { lat: 40.7282, lng: -73.7949 },
    parts: ['esp32', 'raspberry_pi', 'tft_screen', 'temp_sensor', 'camera_module', 'gps_module', 'lora_module', 'solar_panel', 'lipo_battery', 'nfc_module'],
    wants: ['motor_stepper', 'servo', 'joystick', 'mp3_module'],
    bio: 'IoT wizard. Making everything connected.',
    tradesOpen: true,
    online: true,
  },
  {
    id: 'user3',
    username: 'ScrapBot',
    avatar: '🤖',
    level: 55,
    xp: 12400,
    location: { lat: 40.6892, lng: -74.0445 },
    parts: ['motor_dc', 'motor_stepper', 'servo', 'arduino_nano', 'gear_set', 'bearing_set', 'aluminum_sheet', 'spring_set', 'relay_module', 'buck_converter', 'solenoid'],
    wants: ['camera_module', 'raspberry_pi', 'tft_screen'],
    bio: 'Robotics only. Building the machine uprising one servo at a time.',
    tradesOpen: false,
    online: false,
  },
  {
    id: 'user4',
    username: 'NeonDreamer',
    avatar: '💡',
    level: 19,
    xp: 3100,
    location: { lat: 40.7589, lng: -73.9851 },
    parts: ['led_rgb', 'esp32', 'microphone', 'mp3_module', 'speaker', 'oled_screen', 'wire_kit', 'resistor_kit', 'buck_converter', 'usb_cable'],
    wants: ['tft_screen', 'camera_module', 'rotary_encoder'],
    bio: 'LED art and sound reactive installations. Let\'s make things glow.',
    tradesOpen: true,
    online: true,
  },
  {
    id: 'user5',
    username: 'GreenMachine',
    avatar: '🌿',
    level: 33,
    xp: 6800,
    location: { lat: 40.7484, lng: -73.9857 },
    parts: ['solar_panel', 'lipo_battery', 'temp_sensor', 'esp32', 'buck_converter', 'relay_module', 'aluminum_sheet', '3d_printed_case', 'rtc_module', 'sd_card'],
    wants: ['motor_stepper', 'gps_module', 'lora_module', 'pir_sensor'],
    bio: 'Solar powered everything. Off-grid tinkerer.',
    tradesOpen: true,
    online: true,
  },
];

// Helper functions
export function getComponentById(id: string): Component | undefined {
  return components.find(c => c.id === id);
}

export function getDeviceById(id: string): Device | undefined {
  return devices.find(d => d.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getBuildableProjects(userParts: string[]): { project: Project; missing: string[]; have: string[]; percentComplete: number }[] {
  return projects.map(project => {
    const have = project.requiredParts.filter(p => userParts.includes(p));
    const missing = project.requiredParts.filter(p => !userParts.includes(p));
    const percentComplete = Math.round((have.length / project.requiredParts.length) * 100);
    return { project, missing, have, percentComplete };
  }).sort((a, b) => b.percentComplete - a.percentComplete);
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-slate-400';
    case 'uncommon': return 'text-emerald-400';
    case 'rare': return 'text-sky-400';
    case 'epic': return 'text-violet-400';
    case 'legendary': return 'text-amber-400';
    default: return 'text-slate-400';
  }
}

export function getRarityBg(rarity: string): string {
  switch (rarity) {
    case 'common': return 'bg-slate-500/10 border-slate-500/20';
    case 'uncommon': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'rare': return 'bg-sky-500/10 border-sky-500/20';
    case 'epic': return 'bg-violet-500/10 border-violet-500/20';
    case 'legendary': return 'bg-amber-500/10 border-amber-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
}
