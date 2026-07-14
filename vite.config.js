import { defineConfig } from "vite";

export default defineConfig({
  base: "/blackjack-vite/",       // prefijo para todas las URLs en el build final

  build: {
    outDir: "docs",               // Cambia el nombre de la carpeta de salida (por defecto es dist).
    emptyOutDir: true,            // Asegura que la carpeta se vacíe antes de generar un nuevo build, evitando archivos viejos mezclados.
  },

  server: {
    host: true,                   // escucha en 0.0.0.0 (necesario en contenedor)
    port: 5173,
    watch: {
      usePolling: true
    }
  }
});
