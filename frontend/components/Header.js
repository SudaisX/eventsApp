import Link from 'next/link';
import Search from './Search';
import styles from '@/styles/Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/'>Events App</Link>
            </div>

            <Search />

            <nav>
                <ul>
                    <li>
                        <Link href='/events'>Events</Link>
                    </li>
                    <li>
                        <Link href='/events/add'>Add Event</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
