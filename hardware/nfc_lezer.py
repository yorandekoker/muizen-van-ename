# VOORBEELD (niet getest op echte hardware): Raspberry Pi met PN532 meldt welk voorwerp op de lezer ligt.
# Installeren:  pip install adafruit-circuitpython-pn532 requests
import time, requests, board, busio
from adafruit_pn532.i2c import PN532_I2C

URL = "https://jouw-app.example.com/api/detect?key=dezelfde-sleutel-als-HW_KEY"
# UID van elke NTAG215-sticker -> nummer van het voorwerp (1 tot 5). Vul in na het uitlezen van de stickers.
TAGS = {
    # "04a1b2c3d4e5f6": 1,
}

i2c = busio.I2C(board.SCL, board.SDA)
pn532 = PN532_I2C(i2c, debug=False)
pn532.SAM_configuration()
laatste = None
while True:
    uid = pn532.read_passive_target(timeout=0.5)
    if uid is None:
        laatste = None
    else:
        sleutel = uid.hex()
        if sleutel != laatste:
            laatste = sleutel
            if sleutel in TAGS:
                requests.post(URL, json={"item": TAGS[sleutel]}, timeout=5)
            else:
                print("Onbekende sticker:", sleutel)
    time.sleep(0.2)
