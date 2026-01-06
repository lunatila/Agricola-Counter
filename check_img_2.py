import struct

def get_image_info(file_path):
    with open(file_path, 'rb') as f:
        data = f.read(24)
        if data.startswith(b'\x89PNG\r\n\x1a\n'):
            # PNG
            w, h = struct.unpack('>LL', data[16:24])
            return w, h
        else:
            return "Not a PNG or unknown format"

try:
    w, h = get_image_info(r'c:\Users\lacuc\Documents\My Projects\Agricola\Agricola-Counter\Agricola-Counter-claude-agricola-counter-mobile-app-011CV67GhkWqVen8SCvHpLbS\assets\images\backgroundMain.png')
    print(f"Width: {w}, Height: {h}")
except Exception as e:
    print(f"Error: {e}")
