import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';

export default function EventPage({ evt }) {
    const deleteEvent = (e) => {
        console.log('delete');
    };

    return (
        <Layout>
            <div className={styles.event}>
                <Link href='/events'>
                    <a className={styles.back}> {'<'} Go Back</a>
                </Link>

                <div className={styles.controls}>
                    <Link href={`/events/edit/${evt.id}`}>
                        <a>
                            <FaPencilAlt /> Edit Event
                        </a>
                    </Link>
                    <a href='#' className={styles.delete} onClick={deleteEvent}>
                        <FaTimes /> Delete Event
                    </a>
                </div>

                <span>
                    {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
                </span>

                <h1>{evt.name}</h1>

                {evt.image && (
                    <div className={styles.image}>
                        <Image
                            src={evt.image.data.attributes.url}
                            layout='fill'
                            objectFit='contain'
                            alt='image'
                        />
                    </div>
                )}

                <h3>Description</h3>
                <p>{evt.description}</p>

                <h3>Venue: {evt.venue}</h3>
                <p>{evt.address}</p>
            </div>
        </Layout>
    );
}

// export async function getStaticPaths() {
//     const res = await fetch(`${API_URL}/api/events?populate=*`);
//     const { data } = await res.json();
//     const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));

//     const paths = events.map((evt) => ({ params: { slug: evt.slug } }));

//     return {
//         paths,
//         fallback: true,
//     };
// }

// export async function getStaticProps({ params: { slug } }) {
//     const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`);
//     const { data } = await res.json();
//     const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
//     return {
//         props: {
//             evt: events[0],
//         },
//     };
// }

export async function getServerSideProps({ query: { slug } }) {
    const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`);
    const { data } = await res.json();
    const events = data.map((evt) => ({ id: evt.id, ...evt.attributes }));
    return {
        props: {
            evt: events[0],
        },
    };
}
