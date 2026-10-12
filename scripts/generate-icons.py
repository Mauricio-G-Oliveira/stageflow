import zlib
import struct
import math

def create_png(width, height, is_maskable=False, is_apple=False):
    # Colors
    bg_r, bg_g, bg_b = 14, 111, 92  # #0e6f5c
    fg_r, fg_g, fg_b = 255, 255, 255 # White

    # Bar definitions in 48x48 space: (center_x, center_y, width, height, rx)
    # SVG has:
    # bar 1: x=7, y=18, w=4.5, h=12
    # bar 2: x=15, y=10, w=4.5, h=28
    # bar 3: x=23, y=6, w=4.5, h=36
    # bar 4: x=31, y=10, w=4.5, h=28
    # bar 5: x=39, y=18, w=4.5, h=12
    
    bars = [
        (7 + 2.25, 18 + 6, 4.5, 12, 2.25),
        (15 + 2.25, 10 + 14, 4.5, 28, 2.25),
        (23 + 2.25, 6 + 18, 4.5, 36, 2.25),
        (31 + 2.25, 10 + 14, 4.5, 28, 2.25),
        (39 + 2.25, 18 + 6, 4.5, 12, 2.25),
    ]

    # Maskable icons need more safe zone margin (80% safe zone according to W3C)
    scale_factor = 0.65 if is_maskable else 0.78
    if is_apple:
        scale_factor = 0.72

    # Outer corner radius
    # For apple touch icon: iOS adds the squircle mask automatically, so background should be solid fill without corner radius
    # For maskable: Android adds squircle mask, so solid fill
    # For standard pwa icon: nice rounded rect with rx = 0.22 * width
    outer_rx = 0 if (is_maskable or is_apple) else (width * 0.22)

    raw_data = bytearray()
    
    # Precompute distances
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        py = (y + 0.5)
        for x in range(width):
            px = (x + 0.5)

            # Check outer rounded rectangle coverage (anti-aliased)
            if outer_rx > 0:
                # Distance to outer rounded rect
                dx = max(abs(px - width / 2) - (width / 2 - outer_rx), 0)
                dy = max(abs(py - height / 2) - (height / 2 - outer_rx), 0)
                dist_outer = math.hypot(dx, dy) - outer_rx
                # Clamp alpha
                outer_alpha = max(0.0, min(1.0, 0.5 - dist_outer))
            else:
                outer_alpha = 1.0

            if outer_alpha <= 0.0:
                raw_data.extend((0, 0, 0, 0))
                continue

            # Map (px, py) to 48x48 space centered
            # Center of icon: width/2, height/2
            norm_x = (px - width / 2) / (width * scale_factor) * 48 + 24
            norm_y = (py - height / 2) / (height * scale_factor) * 48 + 24

            # Check bars
            in_bar_alpha = 0.0
            for bx, by, bw, bh, br in bars:
                # Signed distance to rounded rect bar
                # Box half-extents
                hw = bw / 2 - br
                hh = bh / 2 - br
                bdx = max(abs(norm_x - bx) - hw, 0)
                bdy = max(abs(norm_y - by) - hh, 0)
                d = math.hypot(bdx, bdy) - br
                
                # Convert distance back to pixel space for antialiasing sharpness
                pixel_d = d * (width * scale_factor / 48)
                alpha = max(0.0, min(1.0, 0.5 - pixel_d))
                if alpha > in_bar_alpha:
                    in_bar_alpha = alpha

            # Composite bar over teal background
            # Background is (bg_r, bg_g, bg_b) with outer_alpha
            # Bar is (255, 255, 255)
            r = int(bg_r * (1 - in_bar_alpha) + fg_r * in_bar_alpha)
            g = int(bg_g * (1 - in_bar_alpha) + fg_g * in_bar_alpha)
            b = int(bg_b * (1 - in_bar_alpha) + fg_b * in_bar_alpha)
            a = int(255 * outer_alpha)

            raw_data.extend((r, g, b, a))

    # Compress IDAT
    compressed = zlib.compress(bytes(raw_data), level=9)

    def chunk(tag, data):
        length = struct.pack('!I', len(data))
        crc = struct.pack('!I', zlib.crc32(tag + data) & 0xffffffff)
        return length + tag + data + crc

    png_bytes = b'\x89PNG\r\n\x1a\n'
    # IHDR: width, height, bit_depth=8, color_type=6 (RGBA), compression=0, filter=0, interlace=0
    ihdr_data = struct.pack('!IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png_bytes += chunk(b'IHDR', ihdr_data)
    png_bytes += chunk(b'IDAT', compressed)
    png_bytes += chunk(b'IEND', b'')

    return png_bytes

sizes = [
    ('public/pwa-192x192.png', 192, 192, False, False),
    ('public/pwa-512x512.png', 512, 512, False, False),
    ('public/pwa-maskable-512x512.png', 512, 512, True, False),
    ('public/apple-touch-icon.png', 180, 180, False, True),
    ('public/favicon-32x32.png', 32, 32, False, False),
    ('public/favicon-16x16.png', 16, 16, False, False),
]

for filename, w, h, maskable, apple in sizes:
    data = create_png(w, h, is_maskable=maskable, is_apple=apple)
    with open(filename, 'wb') as f:
        f.write(data)
    print(f"Generated {filename} ({w}x{h})")
