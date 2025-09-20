# Gallery System Documentation

The ShiftRequest.art site includes a custom gallery system that allows you to showcase art collections.

## How to Add a New Gallery

1. **Create a gallery file** in the `_galleries` directory (e.g., `_galleries/my-gallery.md`)

2. **Add frontmatter** with the gallery configuration:

```yaml
---
title: Gallery Title
description: Description of your gallery
layout: gallery_page
images:
  - filename: image1.jpg
    caption: Caption for image 1
    thumbnail: image1_thumb.jpg
  - filename: image2.jpg
    caption: Caption for image 2
    thumbnail: image2_thumb.jpg
featured_image: image1_thumb.jpg
---

Optional content describing the gallery in more detail.
```

3. **Add your images** to the `assets/images/portfolio/` directory:
   - Full-size images (e.g., `image1.jpg`)
   - Thumbnail images (e.g., `image1_thumb.jpg`)

## Image Requirements

- **Full-size images**: Place original images in `assets/images/portfolio/`
- **Thumbnails**: Create thumbnails with `_thumb.jpg` suffix
- **Featured image**: Used for the gallery index page

## Thumbnail Creation

You can create thumbnails using ImageMagick:

```bash
convert original.jpg -resize 300x300^ -gravity center -extent 300x300 original_thumb.jpg
```

## Gallery Features

- **Responsive grid layout** for both gallery index and individual galleries
- **Lightbox functionality** for viewing full-size images
- **Navigation** between gallery index and individual galleries
- **Image captions** displayed on hover and in lightbox
- **Mobile-friendly** responsive design

## Files Structure

```
_galleries/
  └── my-gallery.md           # Gallery definition
assets/images/portfolio/
  ├── image1.jpg              # Full-size image
  ├── image1_thumb.jpg        # Thumbnail
  ├── image2.jpg
  └── image2_thumb.jpg
_layouts/
  ├── art_gallery_index.html  # Gallery index layout
  └── gallery_page.html       # Individual gallery layout
portfolio.md                 # Main gallery index page
```

The gallery system is fully compatible with GitHub Pages and requires no plugins.