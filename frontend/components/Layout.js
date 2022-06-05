import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/Layout.module.css';

const Layout = ({ title, keywords, description, children }) => {
    return (
        <div className={styles.wrapper}>
            <Head>
                <title>{title}</title>
                <meta name='description' content={description} />
                <meta name='keywords' content={keywords} />
            </Head>

            <Header />
            <div className={styles.container}>{children}</div>
            <Footer />
        </div>
    );
};

Layout.defaultProps = {
    title: 'Events App',
    description: 'Find the latest happening events',
    keywords: 'events, fun, event',
};

export default Layout;
