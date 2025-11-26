import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ERROR_MESSAGES } from '../constants';
import { useToast } from '../hooks/useToast';
import { signIn, useSession } from '../lib/authClient';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Detect if input is email (contains @) or username
      const isEmail = identifier.includes('@');

      const result = isEmail
        ? await signIn.email({
          email: identifier,
          password,
        })
        : await signIn.username({
          username: identifier,
          password,
        });

      if (result.error) {
        throw new Error(result.error.message || ERROR_MESSAGES.LOGIN_FAILED);
      }

      navigate('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN_FAILED,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">bored.fish</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
