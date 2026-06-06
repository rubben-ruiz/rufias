import { redirect } from "next/navigation";

// Home: el comparador de propuestas es la entrada durante la fase de diseño.
export default function Home() {
  redirect("/propuestas");
}
