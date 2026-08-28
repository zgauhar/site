# Static image download mapping

The live MintWave page exposes these image assets. The live page currently uses Wix-hosted media for the hero, device mockups, App Highlights, standout cards, and journey image. citeturn0view0

Save the downloaded files exactly as shown:

| Key | Save as | Used in |
|---|---|---|
| hero | `assets/hero.jpg` | **CSS background** for Home hero + Our Journey |
| ipad | `assets/ipad-mockup.jpg` | Home hero |
| tablet | `assets/tablet-cart.jpg` | Home hero |
| phone | `assets/phone-mockup.jpg` | Home hero |
| phoneCart | `assets/phone-mockup-cart.jpg` | Home hero |
| highlights | `assets/app-highlights.jpg` | App Highlights, Contact |
| phone2 | `assets/phone-mockup-2.jpg` | How Our Apps Stand Out /01 |
| phone3 | `assets/phone-mockup-3.jpg` | How Our Apps Stand Out /02 |

## Download URLs

### 1. Hero / Journey
`https://static.wixstatic.com/media/84770f_ff1e47135ac74cf4a604c7add4cfe4cd~mv2.jpg`

### 2. iPad
`https://static.wixstatic.com/media/84770f_633ba98fbddf444ca1082d45b198117a~mv2.jpg`

### 3. Tablet cart
`https://static.wixstatic.com/media/84770f_339cee94e4bf4793b7077e6b59a70893~mv2.jpg`

### 4. Phone
`https://static.wixstatic.com/media/84770f_c99482b693b744a9aa5f21748a500470~mv2.jpg`

### 5. Phone cart
`https://static.wixstatic.com/media/84770f_8de743e63ae64f0e885146ec017e5ebb~mv2.jpg`

### 6. App Highlights
`https://static.wixstatic.com/media/84770f_d33ed5a047724ede9b2f8527834e0dfb~mv2.jpg`

### 7. Phone mockup 2
`https://static.wixstatic.com/media/84770f_70a4efc07dc64837827c0ad667525a1a~mv2.jpg`

### 8. Phone mockup 3
`https://static.wixstatic.com/media/84770f_b7b4c3ce86fc4edc9ed13a024640267f~mv2.jpg`

The filenames and section assignments above are based on the image elements exposed by the live rendered page. citeturn1view0

After downloading, the clone uses only the local `assets/` paths from `image-manifest.json`, so GitHub Pages no longer depends on Wix to serve the images.


## Background usage

`hero.jpg` is used as a CSS background on `.hero-background` and `.journey-background`, rather than rendered as an `<img>`. After downloading it, replace the two Wix URLs in `styles.css` with `url("assets/hero.jpg")` for a fully local GitHub Pages clone.
