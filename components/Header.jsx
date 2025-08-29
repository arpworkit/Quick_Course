import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';

export default function Header() {
  return (
    <header className="header">
      <Link href="/">
        <Image
          src="/icons/rezoomex_logo_1000w 1.png"
          alt="Rezoomex Logo"
          width={116}
          height={44}
          className="header-logo"
        />
      </Link>
      <div className="header-buttons">
        <Link href="/login">
          <Button variant="secondary" size="small">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="primary" size="small">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
}
