"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña requeridos");
      return;
    }

    if (username.length < 3 || password.length < 4) {
      setError("Usuario mínimo 3 caracteres, contraseña mínimo 4");
      return;
    }

    const stored = localStorage.getItem("admin_credentials");
    const credentials = stored ? JSON.parse(stored) : null;

    if (isNewUser) {
      if (credentials) {
        setError("Ya existe una cuenta. Inicia sesión en su lugar.");
        setIsNewUser(false);
        return;
      }
      // Guardar nuevas credenciales
      localStorage.setItem(
        "admin_credentials",
        JSON.stringify({ username, password })
      );
      localStorage.setItem("admin_token", Date.now().toString());
      router.push("/admin");
    } else {
      if (!credentials) {
        setError("No hay cuenta. Crea una primero.");
        setIsNewUser(true);
        return;
      }

      if (
        credentials.username === username &&
        credentials.password === password
      ) {
        localStorage.setItem("admin_token", Date.now().toString());
        router.push("/admin");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">🔐 Admin Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej: admin"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            {isNewUser ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isNewUser ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => {
                  setIsNewUser(false);
                  setError("");
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿Primera vez?{" "}
              <button
                onClick={() => {
                  setIsNewUser(true);
                  setError("");
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                Crea una cuenta
              </button>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t">
          <Link
            href="/"
            className="text-center text-gray-600 hover:text-gray-800 block"
          >
            ← Volver al home
          </Link>
        </div>
      </div>
    </div>
  );
}
