# Site démo premium — trame réutilisable (V4, claire, vive, images + vidéo + 3D)

Storefront e-commerce premium et personnalisable par prospect. Design clair et vif (réf Space Goods), vrais modèles 3D interactifs, vidéos, section lookbook scrollytelling 3D (images qui surgissent en profondeur), structure de vente complète.

## Déploiement (gratuit, Vercel)
Glisser le dossier dans un projet Vercel (ou `vercel deploy`). 100% statique, 0 dépendance externe (libs, polices, images, vidéos dans /lib, /fonts, /assets).

## IMPORTANT — les images/vidéos sont des EXEMPLES
Les visuels de `assets/img/` (Unsplash) et les 2 vidéos (`assets/hero-film.mp4` mannequin studio, `assets/lookbook.mp4` défilé, footage 1080p libre de droit Pexels) sont des PLACEHOLDERS d'exemple. Pour chaque prospect : les remplacer par ses vrais visuels (photos produit, campagne, lookbook) récupérés sur son site / ses réseaux / Google. Ne jamais présenter un visuel d'exemple comme étant le sien.

## Personnaliser par prospect
1. Couleur marque : `styles.css` `:root` → `--brand` (accent vif) et `--cta` (fond boutons, garder foncé, contraste texte blanc >= 4.5). Blocs colorés : `--lime`, `--cobalt`, `--sun`, `--violet`.
2. Textes : `index.html` → `[NOM MARQUE]`, `[EMAIL]`, titres/copy selon le secteur.
3. Images produit : éditer `PRODUCTS` en haut de `app.js` (champs `a`/`b` = noms de fichiers dans `assets/img/`, 2 vues par produit pour le survol). Déposer les photos du prospect dans `assets/img/` en gardant les noms, ou changer les noms dans le tableau.
4. Lookbook 3D : 4 images dans la section `#story` de `index.html` (balises `<figure class="story__card">`).
5. Hero : vidéo `assets/hero-film.mp4` (+ poster) ; 2 bulles image (`sneaker-a`, `look-shop`) ; 4 avatars `assets/img/av*.jpg`. Idéal : mettre une vraie vidéo de campagne du prospect en hero.
6. Vidéo section : `assets/lookbook.mp4` (+ poster). Remplacer par la vidéo du prospect.
7. Avis : 3 cartes témoignages dans `index.html` (nom, ville, photo, texte). Mettre les VRAIS avis du prospect, jamais inventés.
8. Logo/nav : `data-swap="logo"` et `data-swap="logo-big"`, `<title>`, meta OG.

## Stack & mécaniques
HTML/CSS/JS statique. Lenis (smooth scroll), GSAP + ScrollTrigger (reveals, compteurs, marquee, pin), Three.js (cluster 3D glossy interactif hero, lumières colorées, réactif souris/scroll). Lookbook = flythrough 3D scrubbé (translateZ/rotateY, images en profondeur). Bulles image + déco flottantes à parallaxe souris. Hover produits (swap image), boutons magnetic, curseur custom, accordéon FAQ.
Dégradation : reduced-motion (3D/vidéo/flythrough coupés, statique lisible) ; mobile/touch (pas de Lenis/curseur/parallaxe, lookbook en rangée horizontale, DPR 3D plafonné). Contrastes AA, focus clavier visible.
