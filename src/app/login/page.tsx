import Container from '@/components/common/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <div className="mx-auto mt-4 flex max-w-[500px] flex-col gap-4">
      <Container>
        <form>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="password"
            />
          </div>
          <div className="flex flex-row gap-4">
            <button
              formAction={login}
              className="w-full rounded-md bg-gray-800 px-2 py-1 text-white"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="w-full rounded-md bg-gray-800 px-2 py-1 text-white"
            >
              Sign up
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}
