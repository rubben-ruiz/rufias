// Catálogo mock de Rufias — productos para corredores (precios MXN, datos ficticios)

export type ProductCategory =
  | "hidratación"
  | "energía"
  | "recuperación"
  | "huesos y articulaciones"
  | "básicos";

export interface Product {
  slug: string;
  bib: string; // "número de dorsal" del producto, motivo visual de marca
  name: string;
  category: ProductCategory;
  price: number; // MXN
  blurb: string; // para qué sirve, en una frase de corredor
  dose: string; // rango general seguro
  stock: number;
  badge?: string;
}

export const CATALOG: Product[] = [
  {
    slug: "electrolitos-citrico",
    bib: "01",
    name: "Electrolitos Cítrico",
    category: "hidratación",
    price: 349,
    blurb: "Sodio y potasio para sostener el ritmo en rodajes de más de una hora.",
    dose: "300–600 mg de sodio por hora de carrera",
    stock: 41,
    badge: "El más vendido",
  },
  {
    slug: "gel-energetico-cafeina",
    bib: "02",
    name: "Gel Energético + Cafeína",
    category: "energía",
    price: 549,
    blurb: "Carbohidratos de absorción rápida con 50 mg de cafeína para el último tercio.",
    dose: "1 gel cada 40–45 min en esfuerzos largos",
    stock: 68,
  },
  {
    slug: "proteina-whey-vainilla",
    bib: "03",
    name: "Proteína Whey Vainilla",
    category: "recuperación",
    price: 899,
    blurb: "Recuperación muscular después de series, cuestas y tiradas largas.",
    dose: "20–25 g dentro de la hora post-entreno",
    stock: 27,
  },
  {
    slug: "magnesio-glicinato",
    bib: "04",
    name: "Magnesio Glicinato",
    category: "recuperación",
    price: 429,
    blurb: "Función muscular y mejor descanso en bloques de carga alta.",
    dose: "200–300 mg por la noche",
    stock: 33,
  },
  {
    slug: "vitamina-d3-k2",
    bib: "05",
    name: "Vitamina D3 + K2",
    category: "huesos y articulaciones",
    price: 389,
    blurb: "Refuerzo óseo cuando la carga sube y el riesgo de estrés también.",
    dose: "1000–2000 UI al día",
    stock: 52,
    badge: "Para carga en subida",
  },
  {
    slug: "omega-3-epa-dha",
    bib: "06",
    name: "Omega-3 EPA/DHA",
    category: "básicos",
    price: 549,
    blurb: "Modula la inflamación y acompaña tendones y articulaciones.",
    dose: "1–2 g al día con comida",
    stock: 44,
  },
  {
    slug: "creatina-monohidratada",
    bib: "07",
    name: "Creatina Monohidratada",
    category: "básicos",
    price: 499,
    blurb: "Potencia en cuestas y series; una de las moléculas más estudiadas.",
    dose: "3–5 g al día, cualquier hora",
    stock: 61,
  },
  {
    slug: "hierro-vitamina-c",
    bib: "08",
    name: "Hierro + Vitamina C",
    category: "básicos",
    price: 359,
    blurb: "Transporte de oxígeno para volumen alto — solo si tu médico lo indica.",
    dose: "Según indicación profesional",
    stock: 19,
    badge: "Requiere orientación",
  },
  {
    slug: "cafeina-capsulas",
    bib: "09",
    name: "Cafeína 100 mg",
    category: "energía",
    price: 299,
    blurb: "Dosis medida para días de carrera, sin adivinar cuántos cafés fueron.",
    dose: "1–3 mg por kg, 45–60 min antes",
    stock: 73,
  },
  {
    slug: "colageno-vitamina-c",
    bib: "10",
    name: "Colágeno + Vitamina C",
    category: "huesos y articulaciones",
    price: 599,
    blurb: "Soporte para tendones y rodillas que acumulan kilómetros.",
    dose: "10–15 g, 30–60 min antes de entrenar",
    stock: 38,
  },
];

export const formatMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
