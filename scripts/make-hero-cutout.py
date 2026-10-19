"""Builds the layered hero: a full background frame and a foreground copy with
the sky removed, so display type can sit between the two layers.

Usage: python scripts/make-hero-cutout.py <source.jpg>
Source: Unsplash photo 1523217582562-09d0def993a6 at w=2400 (Unsplash License).
Requires opencv-python and numpy.
"""
import sys
import cv2
import numpy as np

src = cv2.imread(sys.argv[1])
h, w = src.shape[:2]
b, g, r = (src[:, :, i].astype(np.float32) for i in range(3))
gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY).astype(np.float32)

# Sky = blue-dominant, low-texture pixels connected to the top edge.
texture = cv2.GaussianBlur(np.abs(cv2.Laplacian(gray, cv2.CV_32F)), (0, 0), 3)
candidate = ((b > r + 18) & (b > 90) & (texture < 6)).astype(np.uint8)
candidate = cv2.morphologyEx(candidate, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
_, labels = cv2.connectedComponents(candidate)
top_labels = set(np.unique(labels[0][candidate[0] > 0])) - {0}
sky = np.isin(labels, list(top_labels)).astype(np.uint8)
sky = cv2.morphologyEx(sky, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))

# Absorb small holes (wisps of cloud) back into the sky.
count, holes, stats, _ = cv2.connectedComponentsWithStats(1 - sky)
for i in range(1, count):
    x, y, bw, bh, area = stats[i]
    if area < 0.002 * h * w and y + bh < h * 0.9:
        sky[holes == i] = 1

# Hand-tuned for this photo: the hazy band of sky above the right wing's flat
# roof (y < 42%) and the bright sky showing through the pine are too pale for
# the colour test, but everything there that is not dark foliage is sky.
yy, xx = np.mgrid[0:h, 0:w]
right_wing = (xx > 0.715 * w) & (xx < 0.925 * w) & (yy < 0.421 * h)
sky[right_wing & (gray > 120) & (b >= g)] = 1
near_edge = cv2.dilate(sky, np.ones((25, 25), np.uint8)) > 0
sky[near_edge & (xx > 0.71 * w) & (yy < 0.45 * h) & (gray > 150) & (b > g + 5)] = 1

alpha = cv2.GaussianBlur(((1 - sky) * 255).astype(np.uint8), (0, 0), 1.2)
cutout = np.dstack([src, alpha])

for width in (1000, 2000):
    size = (width, round(h * width / w))
    cv2.imwrite(f"public/images/hero-bg-{width}.webp", cv2.resize(src, size, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 70])
    cv2.imwrite(f"public/images/hero-cut-{width}.webp", cv2.resize(cutout, size, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_WEBP_QUALITY, 75])
print("hero layers written")
