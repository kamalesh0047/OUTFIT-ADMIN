// Placeholder imagery uses picsum seeds so the build is self-contained (no asset shipping).
const img = (seed) => `https://picsum.photos/seed/${seed}/800/1000`

export const CATEGORIES = [
  {
    slug: 'shirts',
    label: "Men's Collection",
    cover:
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVucyUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D',
  },
  {
    slug: 'women-dresses',
    label: "Women's Collection",
    cover:
      'https://images.unsplash.com/photo-1756483510802-0acac24ab4e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    cover:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2hlc2Zhc2hpb258ZW58MHx8MHx8fDA%3D',
  },
  {
    slug: 'new-arrivals',
    label: 'New Arrivals',
    cover:
      'https://images.unsplash.com/photo-1731361961158-75691cb80825?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fG5ldyUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D',
  },
]

export const SHIRT_SUBCATEGORIES = {
  shirts: [
    {
      slug: 'executive-formal-shirts',
      label: 'Executive Formal Shirts',
      cover:
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZXhlY3V0aXZlLWZvcm1hbC1zaGlydHMlMjBmb3IlMjBtZW58ZW58MHx8MHx8fDA%3D',
    },
    {
      slug: 'smart-casual-shirts',
      label: 'Smart Casual Shirts',
      cover:
        'https://plus.unsplash.com/premium_photo-1672239496593-f51cdc01c0f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U21hcnQlMjBDYXN1YWwlMjBTaGlydHMlMjBmb3IlMjBtZW58ZW58MHx8MHx8fDA%3D0',
    },
    {
      slug: 'classic-check-shirts',
      label: 'Classic Check Shirts',
      cover:
        'https://images.unsplash.com/photo-1617662408044-cda3ab7134c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2xhc3NpYyUyMENoZWNrJTIwU2hpcnRzJTIwZm9yJTIwbWVufGVufDB8fDB8fHww',
    },
    {
      slug: 'premium-denim-shirts',
      label: 'Premium Denim Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkN8LorTAmrNwZupJYmyN4z5RDmmkOpA0raDO4S1yW7g&s=10',
    },
    {
      slug: 'signature-printed-shirts',
      label: 'Signature Printed Shirts',
      cover:
        'https://images.unsplash.com/photo-1717724162644-75f624f413ca?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2lnbmF0dXJlJTIwUHJpbnRlZCUyMFNoaXJ0cyUyMGZvciUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'luxury-corduroy-shirts',
      label: 'Luxury Corduroy Shirts',
      cover:
        'https://plus.unsplash.com/premium_photo-1672239496412-ab605befa53f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8THV4dXJ5JTIwQ29yZHVyb3klMjBTaGlydHMlMjBmb3IlMjBtZW58ZW58MHx8MHx8fDA%3D',
    },
    {
      slug: 'imported-premium-shirts',
      label: 'Imported Premium Shirts',
      cover:
        'https://images.unsplash.com/photo-1642764873654-9eef0467b342?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SW1wb3J0ZWQlMjBQcmVtaXVtJTIwU2hpcnRzJTIwZm9yJTIwbWVufGVufDB8fDB8fHww',
    },
    {
      slug: 'pure-linen-shirts',
      label: 'Pure Linen Shirts',
      cover:
        'https://images.unsplash.com/photo-1614809294470-65ea1b1efb07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fFB1cmUlMjBMaW5lbiUyMFNoaXJ0cyUyMGZvciUyMG1lbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'party-wear-shirts',
      label: 'Party Wear Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRDGuX65alKz0s_CNJGbovDyaPVrDBvuCI8GtUve40YA&s=10',
    },
    {
      slug: 'office-wear-shirts',
      label: 'Office Wear Shirts',
      cover: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=60',
    },
  ],
  tshirts: [
    {
      slug: 'polo-half-sleeve',
      label: 'Polo T-Shirts (Half Sleeve)',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB19cOVM4ojj5Py7j0SwXm6aBTowrHK8TYwU0SKeK7YA&s=10',
    },
    {
      slug: 'polo-full-sleeve',
      label: 'Polo T-Shirts (Full Sleeve)',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBTxw3EKZ89RJEqVU9UX_H3uNrtTuDLW8Q620TVQxTbA&s=10',
    },
    {
      slug: 'oversized-drop-shoulder',
      label: 'Oversized Drop Shoulder T-Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1WoLHsBuUc-1W3mT-YpN6ocfXwvdPg3YPHoVgD0xt-g&s=10',
    },
    {
      slug: 'half-sleeve-tshirts',
      label: 'Half Sleeve T-Shirts',
      cover:
        'https://images.unsplash.com/photo-1759572095384-1a7e646d0d4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEhhbGYlMjBTbGVldmUlMjBULVNoaXJ0c3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'full-sleeve-tshirts',
      label: 'Full Sleeve T-Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsxliBDMX-vARHRw2rHQTUeMp370r4kr4us7emFFTn-A&s=10',
    },
    {
      slug: 'graphic-printed-tshirts',
      label: 'Graphic Printed T-Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxAUzwZlevL5IQdCiVp76KUg750Fz_hNxNp3uSFnORGw&s=10',
    },
    {
      slug: 'performance-dryfit',
      label: 'Performance Dry-Fit T-Shirts',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiaOa4B3AbzwJALa3-pVGoYZQPoWFhrG11jtY3KyhXeA&s=10',
    },
  ],
}

export const PANTS_SUBCATEGORIES = {
  jeans: [
    { slug: 'balloon-fit-jeans', label: 'Balloon Fit Jeans', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNgTSVwOsA-HUDNrNJo6ne8CbdH9P_KFf6WJ4lINxN-Q&s=10' },
    { slug: 'baggy-fit-jeans', label: 'Baggy Fit Jeans', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-krZ0zSa_og9InB-Zij6WHGP7FmlaIH8zZypHt3ZU6g&s=10' },
    { slug: 'mom-fit-jeans', label: 'Mom Fit Jeans', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-oVF3n29tSSdelhP4OmjHr0iUPsOfFjJdFlZduqfdoA&s=10' },
    { slug: 'regular-fit-jeans', label: 'Regular Fit Jeans', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8fAaMhYRCbPXHMXZHdMMsWYshcJ2ZCmoX0n_UtEglpA&s=10' },
    { slug: 'cargo-fit-jeans', label: 'Cargo Fit Jeans', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb0VcdmjIdph_JxymK0APYKet6GOd6tNdzSP-rtUOftQ&s=10' },
  ],
  pants: [
    { slug: 'linen-pants', label: 'Linen Pants', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj0FQ5D9-1aL5HEUHu33wHOYkRuf9H2uLKjbsDSD89qQ&s=10' },
    { slug: 'imported-premium-pants', label: 'Imported Premium Pants', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWIrLJ3f0_InvRkdTO_STtEMG_YwzSe325lZR1TQIG7g&s' },
    { slug: 'korean-fit-pants', label: 'Korean Fit Pants', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG6p_NS0lv0qofn72oW0QI12fLtPpRcbRLj05YDamaSw&s=10' },
    { slug: 'cotton-pants', label: 'Cotton Pants', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8jbTg2fzXfleMVMWDyEnuaq4Rs7ouIecLnwtzoYVCSQ&s=10' },
    { slug: 'cargo-pants', label: 'Cargo Pants', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqV-nDKXh9fV4ZOD0YQIOauPXTm5jtM2d644DWzbDPA&s=10' },
  ],
  trousers: [
    { slug: 'formal-trousers', label: 'Formal Trousers', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN62RKUnNLM3qXTWFqXmFFAa1jWEln4F51WO6WRDirog&s=10' },
    { slug: 'gurkha-trousers', label: 'Gurkha Trousers', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuj9WN6XIcQPjl1ZORUWEH0zF6iDbNuU8SMihGDag6pw&s=10' },
  ],
  shorts: [
    { slug: 'cotton-shorts', label: 'Cotton Shorts', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGMixhD33Z7qzGIW0VdeBfnQqwCDMDmcSv-c5RoLYciw&s=10' },
    { slug: 'denim-shorts', label: 'Denim Shorts', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKFDkaKlreIAVmt8R6JobmhXk2QmRaQlwAoFWQuaJL1A&s=10' },
    { slug: 'performance-dryfit-shorts', label: 'Performance Dry-Fit Shorts', cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9dEebSiEqJlFji-efAcptVfinXDaasJ1ZXEy2XuR0jA&s' },
  ],
  tracks: [
    { slug: 'track-pants', label: 'Track Pants', cover: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=60' },
    { slug: 'active-wear', label: 'Active Wear', cover: 'https://images.unsplash.com/photo-1517940310602-26535839fe84?w=600&auto=format&fit=crop&q=60' },
  ],
}

export const NEW_ARRIVALS_SUBCATEGORIES = {
  latest: [
    { slug: 'latest-shirts', label: 'Latest Shirts', cover: 'https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { slug: 'latest-tshirts', label: 'Latest T-Shirts', cover: 'https://plus.unsplash.com/premium_photo-1673356302067-aac3b545a362?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFQtc2hpcnRzfGVufDB8fDB8fHww' },
    { slug: 'latest-jeans', label: 'Latest Jeans', cover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGplYW5zfGVufDB8fDB8fHww' },
    { slug: 'latest-pants', label: 'Latest Pants', cover: 'https://images.unsplash.com/photo-1602573991155-21f0143bb45c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhdGVzdCUyMHBhbnRzfGVufDB8fDB8fHww' },
    { slug: 'latest-shorts', label: 'Latest Shorts', cover: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&auto=format&fit=crop&q=60' },
    { slug: 'latest-tracks', label: 'Latest Tracks', cover: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=60' },
  ],
}

export const ACCESSORIES_SUBCATEGORIES = {
  watches: [
    {
      slug: 'watches',
      label: 'Watches',
      cover: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&auto=format&fit=crop&q=60',
    },
  ],
  chains: [
    {
      slug: 'chains',
      label: 'Chains',
      cover: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop&q=60',
    },
  ],
}

export const WOMEN_SUBCATEGORIES = {
  formalPants: [
    {
      slug: 'boot-cut-pants',
      label: 'Boot Cut Pants',
      cover:
        'https://images.unsplash.com/photo-1578693082747-50c396cacd81?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      slug: 'linen-trousers',
      label: 'Linen Trousers',
      cover:
        'https://images.unsplash.com/photo-1779400203775-3baef1c33090?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      slug: 'imported-stretch-pants',
      label: 'Imported Stretch Pants',
      cover:
        'https://plus.unsplash.com/premium_photo-1723701622934-ce90f5b97d5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEltcG9ydGVkJTIwU3RyZXRjaCUyMFBhbnRzJTIwZm9yJTIwd29tZW58ZW58MHx8MHx8fDA%3D',
    },
    {
      slug: 'cotton-pants',
      label: 'Cotton Pants',
      cover:
        'https://plus.unsplash.com/premium_photo-1689977493146-ed929d07d97e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y290dG9uJTIwUGFudHMlMjBmb3IlMjB3b21lbnxlbnwwfHwwfHx8MA%3D%3D',
    },
  ],
  jeans: [
    {
      slug: 'wide-leg-jeans',
      label: 'Wide Leg Jeans',
      cover:
        'https://plus.unsplash.com/premium_photo-1689371953420-b6981e43fa38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHdpZGUtbGVnLWplYW5zfGVufDB8fDB8fHww',
    },
    {
      slug: 'boot-cut-jeans',
      label: 'Boot Cut Jeans',
      cover:
        'https://images.unsplash.com/photo-1603305170009-2800dc601cd4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJvb3QlMjBjdXQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'straight-fit-jeans',
      label: 'Straight Fit Jeans',
      cover:
        'https://plus.unsplash.com/premium_photo-1691367279313-71af7ba83f2d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHN0cmFpZ2h0LWZpdC1qZWFuc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'baggy-fit-jeans',
      label: 'Baggy Fit Jeans',
      cover:
        'https://images.unsplash.com/photo-1616178193482-4dad15347c26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFnZ3klMjBGaXQlMjBKZWFuc3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'high-rise-jeans',
      label: 'High Rise Jeans',
      cover:
        'https://plus.unsplash.com/premium_photo-1689371952452-c88c72464115?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGlnaCUyMFJpc2UlMjBKZWFucyUyMGZvciUyMHdvbWVufGVufDB8fDB8fHww',
    },
  ],
  trousers: [
    {
      slug: 'casual-trousers',
      label: 'Casual Trousers',
      cover:
        'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2FzdWFsJTIwVHJvdXNlcnMlMjBmb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'linen-trousers-women',
      label: 'Linen Trousers',
      cover:
        'https://plus.unsplash.com/premium_photo-1675034810195-00d56274c560?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fExpbmVuJTIwVHJvdXNlciUyMGZvciUyMHdvbWFufGVufDB8fDB8fHww',
    },
  ],
  tops: [
    {
      slug: 'striped-shirts',
      label: 'Striped Shirts',
      cover:
        'https://images.unsplash.com/photo-1651309317367-66d6d0c14268?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0cmlwcGVkJTIwc2hpcnRzJTIwZm9yJTIwd29tYW58ZW58MHx8MHx8fDA%3D',
    },
    {
      slug: 'crop-tops',
      label: 'Crop Tops',
      cover:
        'https://images.unsplash.com/photo-1760551600405-54c70e6d7f42?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3JvcCUyMHRvcHMlMjBmb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'oversized-tshirts',
      label: 'Oversized T-Shirts',
      cover:
        'https://images.unsplash.com/photo-1661110546797-d86cc72a2765?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b3ZlcnNpemVkJTIwdCUyMHNoaXJ0cyUyMGZvciUyMHdvbWFufGVufDB8fDB8fHww',
    },
    {
      slug: 'formal-shirts',
      label: 'Formal Shirts',
      cover:
        'https://images.unsplash.com/photo-1662577327953-bc36d3843e98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZvcm1hbCUyMHNoaXJ0cyUyMGZvciUyMHdvbWFufGVufDB8fDB8fHww',
    },
  ],
  kurti: [
    {
      slug: 'plain-kurti',
      label: 'Plain Kurti',
      cover:
        'https://plus.unsplash.com/premium_photo-1682096128630-c5ec99af10f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmxhcmVkJTIwa3VydGklMjBmb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'designer-kurti',
      label: 'Designer Kurti',
      cover:
        'https://images.unsplash.com/photo-1745313452052-0e4e341f326c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      slug: 'embroidered-kurti',
      label: 'Embroidered Kurti',
      cover:
        'https://images.unsplash.com/photo-1708534419572-6e6614a53ca1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1icm9pZGVyJTIwa3VydGklMjBmb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'flared-kurti',
      label: 'Flared Kurti',
      cover: 'https://images.unsplash.com/photo-1604436607823-d721dfe2df46?w=600&auto=format&fit=crop&q=60',
    },
  ],
  kurtaSets: [
    {
      slug: 'embroidered-kurta-sets',
      label: 'Embroidered Kurta Sets',
      cover:
        'https://images.unsplash.com/photo-1773439878193-be7f99e3bd49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEVtYnJvaWRlcmVkJTIwS3VydGElMjBTZXRzJTIwZm9yJTIwd29tYW58ZW58MHx8MHx8fDA%3D',
    },
    {
      slug: 'palazzo-sets',
      label: 'Palazzo Sets',
      cover:
        'https://images.unsplash.com/photo-1768803968262-320d4752966f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UGFsYXp6byUyMFNldHMlMjBmb3IlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      slug: 'georgette-sets',
      label: 'Georgette Sets',
      cover:
        'https://media.istockphoto.com/id/2233317209/photo/photo-of-beautiful-woman-diwali-celebration-wear-traditional-clothing-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=etJcxvmU2yiSvKeFikEmbhAsTDwQwPdnXd5kBNH6nPY=',
    },
  ],
}
