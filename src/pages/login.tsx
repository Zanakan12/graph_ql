import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Login() {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const credentials = btoa(`${login}:${password}`);

    try {
      const res = await fetch('https://zone01normandie.org/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!res.ok) throw new Error('Identifiants invalides');
      console.log(res)
      const token: string = await res.json();
      localStorage.setItem('jwt', token);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue.');
      }
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black to-blue-800">
      <div className='p-10 border rounded'>
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-64">
          <input
            type="text"
            placeholder="Nom d'utilisateur ou Email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            className="mb-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-2 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">
            Se connecter
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
