import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <SignUp />
    </main>
  );
}
